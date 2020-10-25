/// <reference types="next" />
/// <reference types="next/types/global" />

type ArrayType<T> = T extends Array<infer U> ? U : T;
type MapType<T> = T extends Map<infer K, infer V> ? { key: K; value: V } : T;
type CancellablePromise<T> = Promise<T> & { cancel?: () => void };

module AwesomeImages {
  type Image = {
    id: string;
    width: number;
    height: number;
    likes: number;
    description: string;
    alt_description: string;
    user: {
      id: string;
      username: string;
      name: string;
      first_name: string;
      last_name: string;
      links: {
        html: string;
      };
    };
    urls: {
      raw: string;
      full: string;
      regular: string;
      small: string;
      thumb: string;
    };
    links: {
      self: string;
      html: string;
      download: string;
      download_location: string;
    };
  };

  type List = Map<
    string,
    { title: string; description: string; images: Map<string, Image> }
  >;
}
