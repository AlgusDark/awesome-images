import localForage from "localforage";
import { v4 as uuid } from "uuid";

/**
 * Initialize `awesome-images` database and populates
 * an empty **Favorites** list if the user is _new_
 */
export function init() {
  localForage.config({
    name: "awesome-images",
  });

  localForage.ready(async () => {
    let lists = getAllLists();
    if (!lists) {
      localForage.setItem<AwesomeImages.List>(
        "lists",
        new Map([
          [
            uuid(),
            {
              title: "Favorites",
              description: "Favorites images from internet",
              images: new Map(),
            },
          ],
        ])
      );
    }
  });
}

/**
 * Retrieves the `lists` object from the **DB**
 */
export function getAllLists() {
  return localForage.getItem<AwesomeImages.List>("lists");
}

/**
 * Retrieves a single `list` object from the **DB**
 */
export async function getListById(id: string) {
  let db = await getAllLists();
  let list = db.get(id);
  return {
    ...list,
    images: [...list.images.values()],
  };
}

/**
 * Saves all the changes made to the `lists` object
 * to the **DB**
 */
export function update(list: AwesomeImages.List) {
  return localForage.setItem("lists", list);
}
