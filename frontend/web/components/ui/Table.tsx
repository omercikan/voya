interface TableProps {
  title?: string;
  theads: string[];
  theadTrClassName?: string;
  children?: React.ReactNode;
}

const Table = ({
  title = "",
  theads,
  theadTrClassName,
  children,
}: TableProps) => {
  return (
    <div className="m-6 rounded-xl border border-border bg-card text-card-foreground shadow-none">
      {title && (
        <div className="flex flex-col space-y-1.5 p-6">
          <div>
            <h2 className="font-semibold tracking-tight text-base">{title}</h2>
          </div>
        </div>
      )}

      <div className="w-full overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-225 caption-bottom text-sm">
          <thead>
            <tr
              className={`border-b grid px-6 border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${theadTrClassName}`}
            >
              {theads.map((th) => (
                <th
                  key={th}
                  className="h-10 text-left flex-1 flex items-center font-bold text-muted-foreground whitespace-nowrap"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
