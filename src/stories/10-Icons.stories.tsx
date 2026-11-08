import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icon } from "@/components/ui/icon";
import { IC } from "@/lib/icons";

const meta: Meta = {
  title: "Component CSS/System Icons",
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const AllIcons: StoryObj = {
  render: () => {
    const iconEntries = Object.entries(IC);

    return (
      <div className="max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate">คลังไอคอนระบบ (System Icons)</h1>
          <p className="text-sm text-muted">
            ไอคอน SVG ขนาด 18-24px จาก <code>src/lib/icons.ts</code> รองรับการปรับขนาด สี และความหนาเส้น (stroke)
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {iconEntries.map(([name, path]) => (
            <div
              key={name}
              className="flex flex-col items-center justify-center gap-2 rounded-lg border border-line bg-white p-4 text-center hover:border-teal hover:bg-hover transition-colors"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-teal-light text-teal">
                <Icon d={path} size={22} />
              </div>
              <span className="text-xs font-semibold text-ink font-mono truncate max-w-full">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
