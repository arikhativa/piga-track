import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  FormControl,
  FormError,
  FormField,
  FormLabel,
} from "@/components/admin/form";
import type { InputProps } from "ra-core";
import {
  useInput,
  useResourceContext,
  FieldTitle,
  useTranslate,
} from "ra-core";
import { InputHelperText } from "./input-helper-text";

export type TextArrayInputProps = InputProps & {
  className?: string;
  placeholder?: string;
};

const emptyArray: string[] = [];

/**
 * Form input for editing an array of strings, like tags or email addresses.
 *
 * Renders a text input where values are displayed as removable badges.
 * Users type text and press Enter to add items, or press Backspace
 * when the input is empty to remove the last item.
 *
 * @see {@link https://marmelab.com/shadcn-admin-kit/docs/textarrayinput/ TextArrayInput documentation}
 *
 * @example
 * import { Edit, SimpleForm, TextArrayInput } from '@/components/admin';
 *
 * const PostEdit = () => (
 *   <Edit>
 *     <SimpleForm>
 *       <TextArrayInput source="tags" />
 *       <TextArrayInput source="emails" placeholder="Add an email..." />
 *     </SimpleForm>
 *   </Edit>
 * );
 */
export const TextArrayInput = (props: TextArrayInputProps) => {
  const {
    className,
    defaultValue,
    disabled,
    format,
    helperText,
    label,
    name,
    onBlur,
    onChange,
    parse,
    placeholder,
    readOnly,
    source,
    validate,
    ...rest
  } = props;
  const resource = useResourceContext(props);
  const { id, field, isRequired } = useInput({
    defaultValue,
    format: format ?? ((v) => v ?? emptyArray),
    name,
    onBlur,
    onChange,
    parse,
    source,
    validate,
  });
  const translate = useTranslate();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = React.useState("");

  const values: string[] = field.value ?? emptyArray;

  const handleAddValue = (text: string) => {
    const trimmed = text.trim();
    if (trimmed) {
      field.onChange([...values, trimmed]);
    }
    setInputValue("");
  };

  const handleRemoveValue = (index: number) => {
    field.onChange(values.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        handleAddValue(inputValue);
      }
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      values.length > 0 &&
      !readOnly
    ) {
      field.onChange(values.slice(0, -1));
    } else if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  return (
    <FormField id={id} className={className} name={field.name}>
      {label !== false && (
        <FormLabel>
          <FieldTitle
            label={label}
            source={source}
            resource={resource}
            isRequired={isRequired}
          />
        </FormLabel>
      )}
      <FormControl>
        <div
          className="group rounded-md bg-oklch(1 0 0) shadow-xs dark:bg-oklch(0.922 0.005 325.62)/30 border border-oklch(0.922 0.005 325.62) px-3 py-1.75 text-sm transition-all ring-offset-oklch(1 0 0) focus-within:border-oklch(0.711 0.019 323.02) focus-within:ring-oklch(0.711 0.019 323.02)/50 focus-within:ring-[3px] dark:bg-oklch(0.145 0.008 326) dark:dark:bg-oklch(1 0 0 / 15%)/30 dark:border-oklch(1 0 0 / 10%) dark:border-oklch(1 0 0 / 15%) dark:ring-offset-oklch(0.145 0.008 326) dark:focus-within:border-oklch(0.542 0.034 322.5) dark:focus-within:ring-oklch(0.542 0.034 322.5)/50"
          {...rest}
        >
          <div className="flex flex-wrap gap-1">
            {values.map((value, index) => (
              <Badge key={`${value}-${index}`} variant="outline">
                {value}
                <button
                  className="ms-1 cursor-pointer rounded-full outline-none ring-offset-oklch(1 0 0) focus:ring-2 focus:ring-oklch(0.711 0.019 323.02) focus:ring-offset-2 dark:ring-offset-oklch(0.145 0.008 326) dark:focus:ring-oklch(0.542 0.034 322.5)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRemoveValue(index);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveValue(index);
                  }}
                  disabled={disabled || readOnly}
                >
                  <span className="sr-only">
                    {translate("ra.action.remove", { _: "Remove" })}
                  </span>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (inputValue.trim()) {
                  handleAddValue(inputValue);
                }
                field.onBlur?.();
              }}
              placeholder={values.length === 0 ? placeholder : undefined}
              disabled={disabled}
              readOnly={readOnly}
              className="ms-2 flex-1 bg-transparent outline-none placeholder:text-oklch(0.542 0.034 322.5) dark:placeholder:text-oklch(0.711 0.019 323.02)"
            />
          </div>
        </div>
      </FormControl>
      <InputHelperText helperText={helperText} />
      <FormError />
    </FormField>
  );
};
