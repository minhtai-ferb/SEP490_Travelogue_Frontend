"use client";

import React, { useState } from "react";
import { 
  Button, 
  Dropdown, 
  Modal, 
  Checkbox, 
  Space, 
  message,
  Typography 
} from "antd";
import { 
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { User } from "@/types/Users";

const { Text } = Typography;

interface ExportDataProps {
  users: User[];
  filteredUsers: User[];
}

const ExportData: React.FC<ExportDataProps> = ({ users, filteredUsers }) => {
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    useFiltered: true,
    includePersonalInfo: true,
    includeRoles: true,
    includeWallet: false,
    includeDates: true,
  });
  const [exportFormat, setExportFormat] = useState<'excel' | 'csv' | 'pdf'>('excel');

  const handleExport = () => {
    const dataToExport = exportOptions.useFiltered ? filteredUsers : users;
    
    const exportData = dataToExport.map(user => {
      const data: any = {};
      
      if (exportOptions.includePersonalInfo) {
        data['Họ tên'] = user.fullName;
        data['Email'] = user.email;
        data['Username'] = user.userName;
        data['Số điện thoại'] = user.phoneNumber || 'Chưa có';
        data['Địa chỉ'] = user.address || 'Chưa có';
        data['Giới tính'] = user.genderText;
        data['Trạng thái email'] = user.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực';
      }
      
      if (exportOptions.includeRoles) {
        const activeRoles = user.roles?.filter(role => role.isActive).map(role => role.name) || [];
        const inactiveRoles = user.roles?.filter(role => !role.isActive).map(role => role.name) || [];
        data['Vai trò hoạt động'] = activeRoles.join(', ') || 'Không có';
        data['Vai trò tạm dừng'] = inactiveRoles.join(', ') || 'Không có';
      }
      
      if (exportOptions.includeWallet) {
        data['Số dư ví'] = user.wallet?.userWalletAmount?.toLocaleString('vi-VN') + ' ₫' || '0 ₫';
      }
      
      if (exportOptions.includeDates) {
        data['Ngày tạo'] = new Date(user.createdTime).toLocaleDateString('vi-VN');
        data['Cập nhật lần cuối'] = new Date(user.lastUpdatedTime).toLocaleDateString('vi-VN');
      }
      
      return data;
    });

    // Export logic would go here
    if (exportFormat === 'excel') {
      exportToExcel(exportData);
    } else if (exportFormat === 'csv') {
      exportToCSV(exportData);
    } else if (exportFormat === 'pdf') {
      exportToPDF(exportData);
    }
    
    message.success(`Đã xuất ${dataToExport.length} bản ghi thành công`);
    setExportModalOpen(false);
  };

  const exportToExcel = (data: any[]) => {
    // Implementation for Excel export
    console.log('Exporting to Excel:', data);
    // You would use a library like xlsx here
  };

  const exportToCSV = (data: any[]) => {
    // Implementation for CSV export
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (data: any[]) => {
    // Implementation for PDF export
    console.log('Exporting to PDF:', data);
    // You would use a library like jsPDF here
  };

  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'excel',
      label: 'Excel (.xlsx)',
      icon: <FileExcelOutlined />,
      onClick: () => {
        setExportFormat('excel');
        setExportModalOpen(true);
      },
    },
    {
      key: 'csv',
      label: 'CSV (.csv)',
      icon: <FileTextOutlined />,
      onClick: () => {
        setExportFormat('csv');
        setExportModalOpen(true);
      },
    },
    {
      key: 'pdf',
      label: 'PDF (.pdf)',
      icon: <FilePdfOutlined />,
      onClick: () => {
        setExportFormat('pdf');
        setExportModalOpen(true);
      },
    },
  ];

  return (
    <>
      {/* <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
        <Button icon={<DownloadOutlined />}>
          Xuất dữ liệu
        </Button>
      </Dropdown> */}

      <Modal
        title="Xuất dữ liệu người dùng"
        open={exportModalOpen}
        onOk={handleExport}
        onCancel={() => setExportModalOpen(false)}
        okText="Xuất dữ liệu"
        cancelText="Hủy"
        width={500}
      >
        <div className="space-y-4">
          <div>
            <Text strong>Dữ liệu xuất:</Text>
            <div className="mt-2">
              <Checkbox
                checked={exportOptions.useFiltered}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  useFiltered: e.target.checked
                }))}
              >
                Sử dụng dữ liệu đã lọc ({filteredUsers.length} bản ghi)
              </Checkbox>
              <div className="ml-6 text-sm text-gray-500">
                {exportOptions.useFiltered 
                  ? `Xuất ${filteredUsers.length} người dùng theo bộ lọc hiện tại`
                  : `Xuất tất cả ${users.length} người dùng`
                }
              </div>
            </div>
          </div>

          <div>
            <Text strong>Thông tin bao gồm:</Text>
            <div className="mt-2 space-y-2">
              <Checkbox
                checked={exportOptions.includePersonalInfo}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  includePersonalInfo: e.target.checked
                }))}
              >
                Thông tin cá nhân (tên, email, số điện thoại...)
              </Checkbox>
              <Checkbox
                checked={exportOptions.includeRoles}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  includeRoles: e.target.checked
                }))}
              >
                Thông tin vai trò
              </Checkbox>
              <Checkbox
                checked={exportOptions.includeWallet}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  includeWallet: e.target.checked
                }))}
              >
                Thông tin ví tiền
              </Checkbox>
              <Checkbox
                checked={exportOptions.includeDates}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  includeDates: e.target.checked
                }))}
              >
                Ngày tạo và cập nhật
              </Checkbox>
            </div>
          </div>

          <div>
            <Text strong>Định dạng: </Text>
            <Text code>
              {exportFormat === 'excel' && '.xlsx'}
              {exportFormat === 'csv' && '.csv'}
              {exportFormat === 'pdf' && '.pdf'}
            </Text>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ExportData;
