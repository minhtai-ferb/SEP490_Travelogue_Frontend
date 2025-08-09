"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Calendar, Phone, Mail, Globe } from "lucide-react"

interface CuisineData {
  signatureProduct: string
  cookingMethod: string
  cuisineType: string
  phoneNumber: string
  email: string
  website: string
}

interface CraftVillageData {
  phoneNumber: string
  email: string
  website: string
  workshopsAvailable: boolean
  signatureProduct: string
  yearsOfHistory: number
  isRecognizedByUnesco: boolean
}

interface HistoricalLocationData {
  heritageRank: number
  establishedDate: string
  locationId: string
  typeHistoricalLocation: number
}

interface LocationDetailsProps {
  cuisine?: CuisineData
  craftVillage?: CraftVillageData
  historicalLocation?: HistoricalLocationData
}

export function LocationDetails({ cuisine, craftVillage, historicalLocation }: LocationDetailsProps) {
  const getHistoricalType = (type: number) => {
    switch (type) {
      case 1:
        return "Di tích quốc gia đặc biệt"
      case 2:
        return "Di tích quốc gia"
      case 3:
        return "Di tích cấp tỉnh"
      default:
        return "Không xác định"
    }
  }

  return (
    <div className="space-y-6">
      {/* Cuisine Information */}
      {cuisine && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Thông tin ẩm thực
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">Sản phẩm đặc trưng</p>
              <p className="text-sm text-gray-600">{cuisine.signatureProduct}</p>
            </div>
            <div>
              <p className="font-medium">Phương pháp chế biến</p>
              <p className="text-sm text-gray-600">{cuisine.cookingMethod}</p>
            </div>
            <div>
              <p className="font-medium">Loại ẩm thực</p>
              <p className="text-sm text-gray-600">{cuisine.cuisineType}</p>
            </div>
            {cuisine.phoneNumber && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{cuisine.phoneNumber}</span>
              </div>
            )}
            {cuisine.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{cuisine.email}</span>
              </div>
            )}
            {cuisine.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <a
                  href={cuisine.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {cuisine.website}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Craft Village Information */}
      {craftVillage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Thông tin làng nghề
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">Sản phẩm đặc trưng</p>
              <p className="text-sm text-gray-600">{craftVillage.signatureProduct}</p>
            </div>
            <div>
              <p className="font-medium">Số năm lịch sử</p>
              <p className="text-sm text-gray-600">{craftVillage.yearsOfHistory} năm</p>
            </div>
            <div>
              <p className="font-medium">Workshop có sẵn</p>
              <p className="text-sm text-gray-600">{craftVillage.workshopsAvailable ? "Có" : "Không"}</p>
            </div>
            <div>
              <p className="font-medium">Được UNESCO công nhận</p>
              <p className="text-sm text-gray-600">{craftVillage.isRecognizedByUnesco ? "Có" : "Không"}</p>
            </div>
            {craftVillage.phoneNumber && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{craftVillage.phoneNumber}</span>
              </div>
            )}
            {craftVillage.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{craftVillage.email}</span>
              </div>
            )}
            {craftVillage.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <a
                  href={craftVillage.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {craftVillage.website}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Historical Location Information */}
      {historicalLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Thông tin di tích lịch sử
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">Loại di tích</p>
              <p className="text-sm text-gray-600">{getHistoricalType(historicalLocation.typeHistoricalLocation)}</p>
            </div>
            <div>
              <p className="font-medium">Xếp hạng di sản</p>
              <p className="text-sm text-gray-600">Hạng {historicalLocation.heritageRank}</p>
            </div>
            <div>
              <p className="font-medium">Ngày thành lập</p>
              <p className="text-sm text-gray-600">
                {new Date(historicalLocation.establishedDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
