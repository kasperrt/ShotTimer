interface Props {
  checked: boolean;
  label: string;
  text?: string;
  onChange: () => void;
}

export function Toggle(props: Props) {
  return (
    <label class="inline-flex w-full cursor-pointer items-center justify-between">
      {props.label}
      <div class="flex items-center gap-x-4">
        <input type="checkbox" checked={props.checked} onChange={() => props.onChange()} class="peer sr-only" />
        <span class="ms-3 text-sm font-medium text-gray-600">{props.text}</span>
        <div class="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-green-300 peer-checked:rtl:after:-translate-x-full dark:border-gray-100 dark:bg-gray-200" />
      </div>
    </label>
  );
}
