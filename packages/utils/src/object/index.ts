type ObjectIterator<TObject, TResult> = (
  value: TObject[keyof TObject],
  key: string,
  collection: TObject
) => TResult;

export const map = <T, TResult>(
  input: T,
  callback: ObjectIterator<T, TResult>
) =>
  Object.fromEntries(
    Object.entries(input).map(([key, value]) => [
      key,
      callback(value, key, input)
    ])
  );
