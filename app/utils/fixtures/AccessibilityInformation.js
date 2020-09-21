import { Factory } from 'rosie';

const SentenceInformation = new Factory()
  .sequence('sentenceGroup', index => `sentenceGroup-${index}`)
  .sequence('sentences', index => Array.from(Array(index)).map((_, i) => `sentence-${i}`));

const AccessibilityInformation = new Factory()
  .attr('shortcomings', ['nShortcomings'], nShortcomings => SentenceInformation.buildList(nShortcomings))
  .attr('details', ['nDetails'], nDetails => SentenceInformation.buildList(nDetails));

export default AccessibilityInformation;
