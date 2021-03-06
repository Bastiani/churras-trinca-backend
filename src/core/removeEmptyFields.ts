import { Types } from 'mongoose';

interface IPayload {
  [key: string]: string | number | IPayload[] | IPayload,
}

export function removeEmptyFields(payload: IPayload): any {
  if (!payload) return payload;

  return Object.keys(payload).reduce((acc, key) => {
    if (payload[key] === null) {
      return acc;
    }

    if (typeof payload[key] === 'boolean') {
      return {
        ...acc,
        [key]: payload[key],
      };
    }

    if (Array.isArray(payload[key])) {
      return {
        ...acc,
        [key]: payload[key],
      };
    }

    if (typeof payload[key] === 'object') {
      // this is needed so Flow can keep refinement above
      const o = payload[key];

      if (Types.ObjectId.isValid(o.toString())) {
        return {
          ...acc,
          [key]: o,
        };
      }

      if (Object.values(payload[key]).length) {
        return {
          ...acc,
          [key]: removeEmptyFields(o),
        };
      }

      return acc;
    }

    if (!payload[key]) {
      return acc;
    }

    return {
      ...acc,
      [key]: payload[key],
    };
  }, {});
}
