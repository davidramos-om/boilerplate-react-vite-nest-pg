import { MjmlColumn, MjmlSection, MjmlTable } from "@faire/mjml-react";
import { v4 } from "uuid";

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export const MailmanTable = (payload: Record<string, any>) => {

  const headings = Object.keys(payload.value[ 0 ]);

  return (
    <MjmlSection padding={0} key={v4()}>
      <MjmlColumn>
        <MjmlTable className="styled-table">
          <thead>
            <tr>
              {headings.map((h) => (
                <th key={v4()}>{toTitleCase(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payload.value.map((obj) => {
              const values = Object.values(obj) as string[];
              return (
                <tr key={v4()}>
                  {values.map((v) => (
                    <td key={v4()}>{v}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </MjmlTable>
      </MjmlColumn>
    </MjmlSection>
  );
};
