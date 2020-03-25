# Dev Diary

_The dev diary is a document that contains insights from individual developers who engage in this project. It's unofficial documentation._

## Spring 2020

### Notes about current architecture

The architecture of this application is in a flux state (but only figuratively). From the root of the application you will find two folders: `app` and `src`. Both of these contain code that is in active use.

As far as I understand, `src` is the direction the project was taken towards--so in a sense it's the more current style. The `app` folder was likely the architecture that was preferred originally. The explicit reasons for a change in the architectural style are not known to me--but implicitly it seems like the motivation were, at least in part, to bring this project in line with other JS projects that are developed within Ratkaisutoimisto.

Likely due to resource and time limitations, the refactor isn't complete and likely won't be for a while. Some of the vision for the new architectural direction is hard to decipher--this time it's difficult to see the trees instead of the forest. I'll write down the noteworthy things I think are true with relative confidence.

#### Future direction

Varaamo's architecture will be looked into in a way that will likely yield a future direction the project is going to be moved towards. I do not know the depth of the process, but the knowledge of its existence is enough to suggest some conclusions: (1) we should not spend too much effort in refurbishing the architecture and (2) the death of these notes should be imminent.

#### Notes about redux

This application makes use of `redux` for a lot of things. It's no wonder as this project was first developed during a time when state management still lived its wild west phase and `redux` looked to be a solid way of creating consistency. However, the mood around redux has changed since and that shift is visible in the newer projects under Ratkaisutoimisto's care--as well as older ones like Varaamo. Generally the trend seems to be to avoid using redux when you do not have a specific reason for using it.

Generally speaking, code living within `app` tends to be more `redux` dependent than code living within `src`, but there are exceptions.

In this project you can see the shift in the two ways requests are made into the API. The original model relied on purpose crafted middleware, but since an api client with a more traditional pattern has been added.

This introduces a pesky problem--**depending on how you access the API, response objects may be in either `snake_case` or `camelCase`**. Generally speaking, requests made with the `apiClient` yield `snake_case` responses and requests made through `redux` yield `camelCase` responses. The middleware for making requests seems to transform the by default `snake_case` api responses into `camelCase`.

You'll need to make note of this behaviour when you are building interoperability between the two state management styles. Some components have been built with the `camelCase` assumption--and the `redux` state naturally relies on this assumption.

The project now has a dependency, `camelcase-keys`, which you can use to transform API responses into `camelCase`. For consistency, and as a way to decrease the scope of required changes, you can use this dependency to change API responses into `camelCase`.

Another quirk in `redux` is that some of the selectors translate the object's content for you. Some information, like titles, can be in multiple languages (`en`, `fi`, `sv`). In these instances, the translated field will be an object consisting of `locale` and `translation` key value pairs. With some models, the selectors magically infer the correct translation by using the current locale and will yield a `string` instead of a `translationObject`. The `apiClient` won't do this for you--you'll have to display the correct translation "manually".
