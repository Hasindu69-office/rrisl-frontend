const subjectOptions = [
  { id: 'subject-general-1', label: 'General Inquiry', value: 'general-inquiry-1' },
  { id: 'subject-general-2', label: 'General Inquiry', value: 'general-inquiry-2' },
  { id: 'subject-general-3', label: 'General Inquiry', value: 'general-inquiry-3' },
  { id: 'subject-general-4', label: 'General Inquiry', value: 'general-inquiry-4' },
];

function UnderlineField({
  id,
  label,
  type = 'text',
  placeholder,
  defaultValue,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  autoComplete?: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="block text-[12px] leading-[1.2] text-[#000000]">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        className="mt-2 h-10 w-full border-b border-[rgba(141,141,141,1)] bg-transparent pb-2 text-[18px] leading-6 text-[#102337] outline-none placeholder:text-[rgba(141,141,141,1)] focus:border-[#2E7D32]"
      />
    </label>
  );
}

export default function ContactFormPanel() {
  return (
    <div className="flex h-full min-h-[520px] bg-white px-8 py-8 shadow-[0_18px_60px_rgba(0,0,0,0.08)] md:px-10 md:py-10 lg:px-12 lg:py-12 xl:px-16">
      <form className="flex w-full flex-col" action="#">
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
          <UnderlineField
            id="firstName"
            label="First Name"
            autoComplete="given-name"
          />
          <UnderlineField
            id="lastName"
            label="Last Name"
            autoComplete="family-name"
          />
          <UnderlineField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
          />
          <UnderlineField
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            autoComplete="tel"
          />
        </div>

        <fieldset className="mt-12 border-0 p-0">
          <legend className="text-[12px] font-medium leading-[1.2] text-[#000000]">
            Select Subject?
          </legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {subjectOptions.map((option, index) => (
              <label
                key={option.id}
                htmlFor={option.id}
                className="inline-flex items-center gap-3 text-[12px] leading-[1.2] text-[#102337] cursor-pointer"
              >
                <input
                  id={option.id}
                  type="radio"
                  name="subject"
                  value={option.value}
                  defaultChecked={index === 0}
                  className="h-4 w-4 border border-[rgba(141,141,141,1)] text-[#2E7D32] focus:ring-[#2E7D32]"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label htmlFor="message" className="mt-12 block">
          <span className="block text-[12px] leading-[1.2] text-[#000000]">Message</span>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Write your message.."
            autoComplete="off"
            className="mt-2 min-h-[48px] w-full resize-none border-b border-[rgba(141,141,141,1)] bg-transparent pb-2 text-[18px] leading-6 text-[#102337] outline-none placeholder:text-[rgba(141,141,141,1)] focus:border-[#2E7D32]"
          />
        </label>

        <div className="mt-auto flex justify-end pt-16">
          <button
            type="submit"
            className="inline-flex min-h-[54px] min-w-[180px] items-center justify-center rounded-[5px] bg-[#2E7D32] px-8 py-3 text-[18px] font-medium text-white transition-colors hover:bg-[#27692A] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-2"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
}
