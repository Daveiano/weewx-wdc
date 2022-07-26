import React, { useEffect, useState } from "react";

interface TooltipPropsWindrose {
  title: string;
  color: string;
  template: string;
  replacements: {
    [key: string]: string;
  };
}

export const TooltipWindrose: React.FC<TooltipPropsWindrose> = (
  props: TooltipPropsWindrose
): React.ReactElement => {
  const replaceHoverTemplate = (): string => {
    let text = props.template;

    for (const replacement in props.replacements) {
      text = text.replace(`%{${replacement}}`, props.replacements[replacement]);
    }

    return text;
  };

  const [text, setText] = useState<string>(replaceHoverTemplate());

  useEffect(() => {
    setText(replaceHoverTemplate());
  }, [props.template, props.replacements]);

  return (
    <div
      style={{
        padding: "7px",
        background: "rgb(57 57 57)",
        color: "white",
        boxShadow: `0 2px 6px rgb(57 57 57)`,
        borderLeft: `5px solid ${props.color}`,
        textAlign: "right",
      }}
      className="diagram-tooltip windrose"
    >
      <div style={{ paddingBottom: "5px", whiteSpace: "nowrap" }}>
        {props.title}
      </div>
      <div
        style={{ whiteSpace: "nowrap" }}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
};
