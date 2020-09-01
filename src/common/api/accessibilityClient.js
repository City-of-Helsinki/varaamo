import { ApiClient } from './client';
import constants from '../../../app/constants/AppConstants';

export class AccessibilityApiClient {
  apiClient;

  systemId;

  constructor(baseUrl, systemId) {
    this.apiClient = new ApiClient(baseUrl, false);
    this.systemId = systemId;
  }

  getAccessibilityInformation(resourceId, viewPoints = [], locale = 'fi') {
    return Promise.all([
      this.getSentences(resourceId, locale),
      this.getShortcomings(resourceId, viewPoints, locale),
      // eslint-disable-next-line
    ]).then(([details, shortcomings]) => details.length > 0 || shortcomings.length > 0
      ? { details, shortcomings }
      : undefined);
  }

  getSentences(resourceId, locale = 'fi') {
    return this.apiClient
      .get(`targets/${this.systemId}/${resourceId}/sentences`)
      .then((res) => {
        return res.data
          .map((sentenceObject) => {
            return {
              sentenceGroup: sentenceObject.sentenceGroups.find(
                sentenceGroup => sentenceGroup.language === locale,
              ).value,
              sentences: sentenceObject.sentences
                .filter(sentence => sentence.language === locale)
                .map(sentence => sentence.value),
            };
          })
          .reduce((acc, sentenceObject) => {
            const index = acc.findIndex(
              accSentence => accSentence.sentenceGroup === sentenceObject.sentenceGroup,
            );

            if (index >= 0) {
              acc[index] = {
                ...acc[index],
                sentences: [
                  ...acc[index].sentences,
                  ...sentenceObject.sentences,
                ],
              };
              return acc;
            }

            return [...acc, sentenceObject];
          }, []);
      });
  }

  getShortcomings(resourceId, viewPoints = [], locale = 'fi') {
    // eslint-disable-next-line
    return Promise.all([
      this.apiClient.get(`targets/${this.systemId}/${resourceId}/shortages`),
      this.apiClient.get('viewpoints'),
    ]).then(([shortagesRes, viewpointsRes]) => {
      const idToNameMap = {};

      viewpointsRes.data.forEach((viewpoint) => {
        idToNameMap[viewpoint.viewpointId] = viewpoint.names.find(
          name => name.language === locale,
        ).value;
      });

      return shortagesRes.data
        .map(shortage => ({
          id: shortage.viewpointId,
          sentence: shortage.shortages.find(
            shortageSentence => shortageSentence.language === locale,
          ).value,
        }))
        .reduce((acc, shortage) => {
          const index = acc.findIndex(accItem => accItem.id === shortage.id);

          if (index >= 0) {
            acc[index] = {
              ...acc[index],
              sentences: [...acc[index].sentences, shortage.sentence],
            };
            return acc;
          }

          return [...acc, { id: shortage.id, sentences: [shortage.sentence] }];
        }, [])
        .filter(shortage => viewPoints.includes(shortage.id))
        .map(shortage => ({
          sentenceGroup: idToNameMap[shortage.id],
          sentences: shortage.sentences,
        }));
    });
  }
}

export default new AccessibilityApiClient(
  constants.ACCESSIBILITY_API_URL,
  constants.ACCESSIBILITY_API_SYSTEM_ID,
);
