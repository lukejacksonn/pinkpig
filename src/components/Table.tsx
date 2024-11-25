export const Table = (props: {
  title: string;
  data: Record<string, any>;
  fields: string[];
  footer?: string;
  keyFn?: (key: string) => string;
  valueFn?: (value: any) => string;
}) => {
  const { title, data, fields, footer, valueFn, keyFn } = props ?? {};

  function orderObjectEntries<T>(
    keys: string[],
    obj: Record<string, T>
  ): [string, T][] {
    return keys
      ?.map((key): [string, T] => [
        key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        obj[key],
      ])
      .filter(([_, value]) => value !== undefined);
  }

  return (
    <div className="flex flex-col ~gap-6/8">
      <div className="flex items-center gap-10">
        <h3 className="font-display text-xl text-prose">{title}</h3>
        <hr className="flex-1 border-t border-line" />
      </div>
      <ul className="grid grid-cols-1 border rounded-lg divide-y">
        {orderObjectEntries(fields, data)?.map(([key, value]) => (
          <li className="flex items-center justify-between px-5 py-3 gap-8">
            <p className="text-prose/80 capitalize">
              {keyFn ? keyFn(key) : key}
            </p>
            <p className="text-prose font-medium truncate">
              {valueFn ? valueFn(value) : value}
            </p>
          </li>
        ))}
      </ul>
      {footer && (
        <p className="text-xs leading-[1.38rem] text-prose/60">{footer}</p>
      )}
    </div>
  );
};
