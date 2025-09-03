'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDate } from 'date-fns'
import {
  Calendar,
  Users,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Clock,
  Hash,
  Eye,
  FileText
} from 'lucide-react'
import StatusBadge from './status-badge'
import { Booking } from '@/services/use-dashbroad'

interface BookingDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking: Booking | null
}

export default function BookingDetailModal({ open, onOpenChange, booking }: BookingDetailModalProps) {
  if (!booking) return null

  const getStatusColor = (status: number): string => {
    const statusColors: Record<number, string> = {
      1: "bg-yellow-100 text-yellow-800 border-yellow-200", // Pending
      2: "bg-blue-100 text-blue-800 border-blue-200", // Confirmed
      3: "bg-green-100 text-green-800 border-green-200", // In Progress
      4: "bg-red-100 text-red-800 border-red-200", // Cancelled
      5: "bg-emerald-100 text-emerald-800 border-emerald-200", // Completed
    }
    return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getBookingTypeColor = (type: number): string => {
    const typeColors: Record<number, string> = {
      1: "bg-blue-600", // Tour
      2: "bg-purple-600", // Workshop
      3: "bg-orange-600", // Custom
    }
    return typeColors[type] || "bg-gray-600"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-semibold">
                Chi tiết đặt {booking.bookingTypeText.toLowerCase()}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge className={`${getBookingTypeColor(booking.bookingType)} text-white flex items-center gap-1`}>
                  <Hash className="w-4 h-4" />
                  {booking.bookingTypeText}
                </Badge>
                <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1 border`}>
                  {booking.statusText}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Booking ID</p>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{booking.id}</code>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tour Information */}
          <Card>
            <CardHeader className="pb-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Thông tin tour
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tên tour</p>
                  <p className="font-semibold text-lg">{booking.tourName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ngày khởi hành</p>
                  <p className="font-medium">{formatDate(new Date(booking.departureDate), 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ngày bắt đầu</p>
                  <p className="font-medium">{formatDate(new Date(booking.startDate), 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ngày kết thúc</p>
                  <p className="font-medium">{formatDate(new Date(booking.endDate), 'dd/MM/yyyy')}</p>
                </div>
                {booking.tourGuideName && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Hướng dẫn viên</p>
                    <p className="font-medium">{booking.tourGuideName}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader className="pb-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Thông tin khách hàng
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tên liên hệ</p>
                  <p className="font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {booking.contactName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Số điện thoại</p>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {booking.contactPhone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {booking.contactEmail}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Địa chỉ</p>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {booking.contactAddress || 'Chưa cung cấp'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          {booking.participants && booking.participants.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  Danh sách người tham gia ({booking.participants.length})
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {booking.participants.map((participant, index) => (
                    <div key={participant.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Tên</p>
                          <p className="font-medium">{participant.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Giới tính</p>
                          <p className="font-medium">{participant.genderText}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Ngày sinh</p>
                          <p className="font-medium">
                            {formatDate(new Date(participant.dateOfBirth), 'dd/MM/yyyy')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Số lượng</p>
                          <p className="font-medium">{participant.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pricing Details */}
          <Card>
            <CardHeader className="pb-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Chi tiết thanh toán
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Giá gốc</span>
                  <span className="font-medium">{booking.originalPrice.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                {booking.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Giảm giá</span>
                    <span className="font-medium">-{booking.discountAmount.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng cần thanh toán</span>
                  <span className="text-green-600">{booking.finalPrice.toLocaleString('vi-VN')} VNĐ</span>
                </div>
              </div>
              {booking.paymentLinkId && (
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">Payment Link ID</p>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{booking.paymentLinkId}</code>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Lịch sử booking
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Thời gian đặt</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(new Date(booking.bookingDate), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                
                {booking.cancelledAt && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <FileText className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium">Thời gian hủy</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(new Date(booking.cancelledAt), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">Trạng thái hiện tại</p>
                    <StatusBadge status={booking.status} statusText={booking.statusText} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
