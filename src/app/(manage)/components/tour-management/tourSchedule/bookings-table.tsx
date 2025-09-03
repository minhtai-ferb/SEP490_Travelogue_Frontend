'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from 'date-fns'
import {
  Calendar,
  Users,
  User,
  Phone,
  Mail,
  Eye
} from 'lucide-react'
import StatusBadge from './status-badge'
import BookingDetailModal from './booking-detail-modal'
import { Booking } from '@/services/use-dashbroad'

interface BookingsTableProps {
  bookings: Booking[]
}

export default function BookingsTable({ bookings }: BookingsTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBooking(null)
  }
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Danh Sách Booking ({bookings.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Chưa có booking nào</p>
            <p className="text-sm">Chưa có khách hàng nào đặt tour cho lịch trình này</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Thông tin tour</TableHead>
                  <TableHead className="w-[200px]">Khách hàng</TableHead>
                  <TableHead className="w-[120px]">Trạng thái</TableHead>
                  <TableHead className="w-[100px]">Số người</TableHead>
                  <TableHead className="w-[120px]">Tổng tiền</TableHead>
                  <TableHead className="w-[150px]">Ngày đặt</TableHead>
                  <TableHead className="w-[80px]">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-gray-50">
                    {/* Tour Info */}
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">{booking.tourName}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(new Date(booking.departureDate), 'dd/MM/yyyy')}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{booking.bookingTypeText}</Badge>
                      </div>
                    </TableCell>

                    {/* Customer Info */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-gray-400" />
                          <span className="font-medium text-sm">{booking.contactName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{booking.contactPhone}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[150px]">{booking.contactEmail}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge status={booking.status} statusText={booking.statusText} />
                    </TableCell>

                    {/* Participants Count */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold">{booking.participants.length}</span>
                      </div>
                    </TableCell>

                    {/* Price */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-semibold text-green-600">
                          {booking.finalPrice.toLocaleString('vi-VN')} VNĐ
                        </div>
                        {booking.discountAmount > 0 && (
                          <div className="text-xs text-red-500">
                            -{booking.discountAmount.toLocaleString('vi-VN')} VNĐ
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Booking Date */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {formatDate(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(new Date(booking.bookingDate), 'HH:mm')}
                        </div>
                        {booking.cancelledAt && (
                          <div className="text-xs text-red-500">
                            Hủy: {formatDate(new Date(booking.cancelledAt), 'dd/MM/yyyy')}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewBooking(booking)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        booking={selectedBooking}
      />
    </Card>
  )
}
