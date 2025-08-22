import { Modal, Form, InputNumber, DatePicker } from "antd";
import dayjs from "dayjs";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  type: number; // 1 = Tour Guide, 2 = Làng nghề
  loading?: boolean;
}

export default function CommissionFormModal({
  open,
  onCancel,
  onSubmit,
  type,
  loading,
}: Props) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  return (
    <Modal
      open={open}
      title={type === 1 ? "Thêm hoa hồng Hướng dẫn viên" : "Thêm hoa hồng Làng nghề"}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tỉ lệ (%)"
          name="rateValue"
          rules={[
            { required: true, message: "Vui lòng nhập tỉ lệ" },
            {
              type: "number",
              min: 1,
              max: 100,
              message: "Tỉ lệ phải nằm trong khoảng 1 - 100",
            },
          ]}
        >
          <InputNumber className="w-full" min={1} max={100} />
        </Form.Item>

        <Form.Item
          label="Ngày & Giờ hiệu lực"
          name="effectiveDate"
          rules={[
            { required: true, message: "Vui lòng chọn ngày & giờ hiệu lực" },
            () => ({
              validator(_, value) {
                if (!value) return Promise.resolve();
                if (value.isAfter(dayjs())) return Promise.resolve();
                return Promise.reject(
                  new Error("Ngày hiệu lực phải lớn hơn thời điểm hiện tại")
                );
              },
            }),
          ]}
        >
          <DatePicker
            className="w-full"
            format="DD/MM/YYYY HH:mm"
            showTime={{ format: "HH:mm" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
