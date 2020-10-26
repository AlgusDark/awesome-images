# Awesome Images 📷

A MVP of a simple image search using [unsplash](https://unsplash.com/) API.

## Features ⚙️

- **Search**
  - live search (just start typing with your imagination)
- **Image**
  - *Hover* or *click* the image
    - Display the author of the image
    - Star the image and save it in a custom *list*
    - Download the image
- **List**
  - Save a *list* with custom *title* and *description*
  - Edit *title* and *description*
  - View images corresponding to a *list*

## Tools 🧰

  - [React](https://reactjs.org/)
  - [Next.js](https://nextjs.org/)
  - [Chakra UI](https://next.chakra-ui.com/)
  - [React-Query](https://github.com/tannerlinsley/react-query)
  - [FileSaver](https://github.com/eligrey/FileSaver.js)
  - [ky](https://github.com/sindresorhus/ky)
  - [localForage](https://github.com/localForage/localForage)
  - [react-icons](https://github.com/react-icons/react-icons)
  - [uuid](https://github.com/uuidjs/uuid)

Writen in [TypeScript](https://www.typescriptlang.org/) flavor.

## How to Run 💻

You should create a `.env` file with the following and change `${CHANGE_ME}` to your own configuration:

```
NEXT_PUBLIC_UNPLASH_ACCESSKEY=${CHANGE_ME}
```

You need to install `npm` modules with:

```
$ npm install
```

### Development 🚧

```
$ npm run dev
```

### Production 🏢

```
$ npm run build
```

```
$ npm start
```

## TODO ✅

- [ ] Better Error handling
  - As an MVP, the assumption is happy path for most of the actions.
- [ ] Better loading indicators
- [ ] Write tests
  - [Cypress](https://www.cypress.io/) for E2E and [React Testing Library](https://github.com/testing-library/react-testing-library) for integration tests.
- [ ] Responsive design
  - [ ] For the moment this is for **desktop** only
- [ ] Shareable links
  - [ ] Use the power of the [router](https://nextjs.org/docs/api-reference/next/router) to save the current state of the interaction. This could be an improvement to remove the `activeVariable`'s from codebase and make the use of [query parameters](https://nextjs.org/docs/routing/dynamic-routes) to have a URL to share/save and access in the future.
- [ ] **Lists**
  - [ ] Delete an image from a list
  - [ ] Delete a list
- [ ] **Images**
  - [ ] Indicate that an image is already saved in a **list**.
  - [ ] Modal navigation to previous/next image
- [ ] [Prefetching](https://react-query.tanstack.com/docs/guides/prefetching) could improve the UX on the **Search**