import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ErrorState } from "@/components/feedback/error-state";
import { ComingSoon, EmptyState, ForbiddenView } from "@/components/feedback/states";

const meta: Meta = {
  title: "Component CSS/4-State UI Views",
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const EmptyStateStory: StoryObj = {
  name: "Empty State",
  render: () => (
    <div className="max-w-2xl">
      <EmptyState
        title="ยังไม่มีใบสมัครรออนุมัติ"
        text="เมื่อเจ้าหน้าที่ทะเบียนส่งใบสมัครใหม่เข้ามา รายการจะแสดงขึ้นที่นี่เพื่อให้ตรวจสอบ"
        action={{ label: "ไปที่รายชื่อสมาชิก", href: "/members" }}
      />
    </div>
  ),
};

export const FilterEmptyStateStory: StoryObj = {
  name: "Empty State (Filtered)",
  render: () => (
    <div className="max-w-2xl">
      <EmptyState
        title="ไม่พบข้อมูลที่ตรงกับตัวกรอง"
        text="ลองเปลี่ยนคำค้นหา หรือกดปุ่มล้างตัวกรองเพื่อดูรายการสมาชิกทั้งหมดในระบบ"
        action={{ label: "ล้างตัวกรอง", href: "#" }}
      />
    </div>
  ),
};

export const ForbiddenViewStory: StoryObj = {
  name: "Forbidden (403)",
  render: () => (
    <div className="max-w-2xl">
      <ForbiddenView roleName="สมาชิก" />
    </div>
  ),
};

export const ComingSoonStory: StoryObj = {
  name: "Coming Soon",
  render: () => (
    <div className="max-w-2xl">
      <ComingSoon title="ระบบสินเชื่อและสัญญาเงินกู้" story="Story 0008 (Loan Management)" />
    </div>
  ),
};

export const ErrorStateStory: StoryObj = {
  name: "Error State (with Retry)",
  render: () => (
    <div className="max-w-2xl">
      <ErrorState
        reset={() => alert("กำลังเรียกใช้งานคำสั่ง reset() เพื่อลองโหลดใหม่อีกครั้ง...")}
        digest="ERR_NETWORK_TIMEOUT_20261108"
      />
    </div>
  ),
};
