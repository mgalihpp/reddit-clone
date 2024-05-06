import React from 'react';

interface TableRenderProps {
  data: {
    withHeadings: boolean;
    content: string[][];
  };
}

function CustomTableRender({ data }: TableRenderProps) {
  const withHeadings = data.withHeadings === true ? true : false;

  const header = data.content[0];

  return (
    <>
      {data.content.length > 0 && (
        <Table data={data} header={header} withHeadings={withHeadings} />
      )}
    </>
  );
}

export default CustomTableRender;

interface Tableprops {
  header: string[];
  withHeadings: boolean;
  data: {
    content: string[][];
  };
}

const Table: React.FC<Tableprops> = ({ header, withHeadings, data }) => {
  return (
    <div className="max-w-lg overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-center text-sm">
        {withHeadings && (
          <thead>
            <tr className='bg-gray-200'>
              {header.map((item, index) => (
                <th
                  key={index}
                  className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-gray-200">
          {data.content.slice(1).map((row, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              {row.map((item, cellIndex) => (
                <td
                  key={cellIndex}
                  className="whitespace-nowrap px-4 py-2 text-gray-700"
                >
                  {item}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
