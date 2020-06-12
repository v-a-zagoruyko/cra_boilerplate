import { AxiosRequestConfig } from 'axios';
import { action } from 'mobx';
import { camelizeKeys } from 'humps';

export interface Struct<T, E> {
  data?: T;
  errors?: E;
  isFetching: boolean;
}

export interface StructFlowOpts<T> {
  transformResponse?(data: T): T;
}

export interface GenericStructFlow {
  <T>(s: Struct<T, any>, c: AxiosRequestConfig, o: StructFlowOpts<T>): Promise<
    any
  >;
}

interface AuthStructFlowOpts<T> extends StructFlowOpts<T> {
  authStore?: any;
}

export const getDefaultStruct = <T>(): Struct<T, any> => ({
  data: undefined,
  errors: undefined,
  isFetching: false,
});

const defaultOpts = {
  transformResponse: (d: any) => d,
};

export const createStructFlow = (request: any = {}) => <T>(
  struct: Struct<T, any>,
  axiosParams: AxiosRequestConfig,
  opts: StructFlowOpts<T> = defaultOpts,
): Promise<any> => {
  const runAction = action(async () => {
    struct.data = undefined;
    struct.errors = undefined;
    struct.isFetching = true;
    try {
      const { data } = await request(axiosParams);
      const { transformResponse } = opts;
      const preparedData = transformResponse ? transformResponse(data) : data;
      struct.data = (preparedData as T) || ({} as T);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
      struct.errors = error;
    } finally {
      struct.isFetching = false;
    }
  });
  return runAction();
};

export const structFlow = createStructFlow();

export async function authStructFlow<T>(
  struct: Struct<T, any>,
  axiosParams: AxiosRequestConfig,
  opts: AuthStructFlowOpts<T> = defaultOpts,
): Promise<any> {
  const transformResponse = (d: T) => {
    const camelizedPayload = camelizeKeys(d as any) as any;
    if (opts.transformResponse) {
      return opts.transformResponse(camelizedPayload);
    }
    return camelizedPayload;
  };

  await structFlow<T>(
    struct,
    {
      ...axiosParams,
      headers: {
        ...axiosParams.headers,
      },
    },
    {
      ...opts,
      transformResponse,
    },
  );
}
