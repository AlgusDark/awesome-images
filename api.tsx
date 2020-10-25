import ky from "ky";
import { saveAs } from "file-saver";
import {
  useQuery,
  useMutation,
  useQueryCache,
  usePaginatedQuery,
} from "react-query";
import { v4 as uuid } from "uuid";
import * as db from "db";

let baseUrl = "https://api.unsplash.com";
let api = ky.create({
  prefixUrl: baseUrl,
  headers: {
    "Accept-Version": "v1",
    Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNPLASH_ACCESSKEY}`,
  },
});

/**
 * Fetcher function to be used with `usePaginatedQuery`
 * to retreive the photos results from `unplash` API
 */
function getImagesFromUnplash(
  _key: string,
  options: { query: string; page?: number }
) {
  let controller = new AbortController();
  let signal = controller.signal;

  let promise: CancellablePromise<{
    total: number;
    total_pages: number;
    results: AwesomeImages.Image[];
  }> = api
    .extend({ signal })
    .get("search/photos", { searchParams: { ...options, per_page: 25 } })
    .json();

  promise.cancel = () => controller.abort();

  return promise;
}

type SearchPhotosOptions = { query: string; page: number };

/**
 * Pagination hook to retrieve photos from `unplash` API
 */
export function useSearchPhotosPaginatedQuery({
  query,
  page,
}: SearchPhotosOptions) {
  return usePaginatedQuery(["images", { query, page }], getImagesFromUnplash);
}

/**
 * Opens a save file dialog for an image
 */
export async function downloadImage(image: AwesomeImages.Image) {
  let extended = api.extend({ prefixUrl: "" });

  let photo = await extended
    .get(image.links.download_location)
    .json<{ url: string }>();

  return saveAs(photo.url, `photo-${image.id}`);
}

type ListData = {
  id?: string;
  title?: string;
  description?: string;
};

type SaveToListOptions = {
  image: AwesomeImages.Image;
} & ListData;

/**
 * fetcher function to `add` an _image_ to a **list**
 * or `create` a new **list** with the desired _image_
 */
async function saveToList({
  id,
  title,
  description,
  image,
}: SaveToListOptions) {
  let list = await db.getAllLists();

  if (list.has(id)) {
    // add to list
    list.get(id).images.set(image.id, image);
  } else {
    // create new list
    list.set(uuid(), {
      title,
      description,
      images: new Map([[image.id, image]]),
    });
  }

  return db.update(list);
}

/**
 * Mutation hook to save a `list`
 */
export function useSaveToListMutation() {
  let queryCache = useQueryCache();

  return useMutation(saveToList, {
    onSuccess: () => {
      queryCache.invalidateQueries("lists");
    },
  });
}

/**
 * fetcher function to `update` a list _title_ and _description_
 */
async function patchList({ id, title, description }: ListData) {
  let list = await db.getAllLists();

  if (list.has(id)) {
    let originalList = list.get(id);
    (originalList.title = title), (originalList.description = description);
  }

  return db.update(list);
}

/**
 * Mutation hook to `update` a list
 */
export function usePATCHListMutation() {
  let queryCache = useQueryCache();

  return useMutation(patchList, {
    onSuccess: () => {
      queryCache.invalidateQueries("lists");
    },
  });
}

/**
 * fetcher function to retrieve all the `lists`
 */
async function getLists() {
  let lists = await db.getAllLists();
  return [...lists.entries()].map(([key, { title, description }]) => ({
    id: key,
    title: title,
    description: description,
  }));
}

/**
 * Query hook to retrieve all the lists
 */
export function useListsQuery() {
  return useQuery("lists", getLists);
}

/**
 * fetcher function to retrieve a single `list`
 */
function getList(_key: string, { id }: { id: string }) {
  return db.getListById(id);
}

/**
 * Query hook to retrieve a single `list`
 */
export function useListQuery(id: string) {
  return useQuery(["lists", { id }], getList, { enabled: id });
}
