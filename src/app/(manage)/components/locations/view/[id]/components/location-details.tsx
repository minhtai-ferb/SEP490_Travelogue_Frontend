"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Calendar, Phone, Mail, Globe, ChefHat, Hammer, Landmark, Star, Clock, Shield } from "lucide-react"

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

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") {
      return "Chưa cập nhật"
    }
    return value
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa cập nhật"
    try {
      return new Date(dateString).toLocaleDateString("vi-VN")
    } catch {
      return "Chưa cập nhật"
    }
  }

  return (
    <div className="space-y-6">
      {/* Show fallback if no specific location type data */}
      {!cuisine && !craftVillage && !historicalLocation && (
        <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-700">
              <Award className="w-5 h-5" />
              Thông tin bổ sung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 font-medium">Chưa có thông tin chi tiết</p>
              <p className="text-gray-400 text-sm mt-1">
                Thông tin bổ sung sẽ được cập nhật sau
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cuisine Information */}
      {cuisine && (
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <ChefHat className="w-5 h-5" />
              Thông tin ẩm thực
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Signature Product */}
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-orange-600" />
                <p className="font-medium text-gray-900">Sản phẩm đặc trưng</p>
              </div>
              <p className="text-sm text-gray-700 font-medium">
                {formatValue(cuisine.signatureProduct)}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-orange-200">
                <span className="text-sm font-medium text-gray-700">Phương pháp chế biến:</span>
                <span className="text-sm text-gray-600">{formatValue(cuisine.cookingMethod)}</span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-orange-200">
                <span className="text-sm font-medium text-gray-700">Loại ẩm thực:</span>
                <span className="text-sm text-gray-600">{formatValue(cuisine.cuisineType)}</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-orange-800 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Thông tin liên hệ
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-white p-2 rounded border border-orange-200">
                  <Phone className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">{formatValue(cuisine.phoneNumber)}</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded border border-orange-200">
                  <Mail className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">{formatValue(cuisine.email)}</span>
                </div>
                {cuisine.website && cuisine.website !== "" ? (
                  <div className="flex items-center gap-2 bg-white p-2 rounded border border-orange-200">
                    <Globe className="w-4 h-4 text-orange-600" />
                    <a
                      href={cuisine.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {cuisine.website}
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-white p-2 rounded border border-orange-200">
                    <Globe className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-500">Chưa cập nhật</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Craft Village Information */}
      {craftVillage && (
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Hammer className="w-5 h-5" />
              Thông tin làng nghề
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Signature Product */}
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-purple-600" />
                <p className="font-medium text-gray-900">Sản phẩm đặc trưng</p>
              </div>
              <p className="text-sm text-gray-700 font-medium">
                {formatValue(craftVillage.signatureProduct)}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-purple-200">
                <span className="text-sm font-medium text-gray-700">Số năm lịch sử:</span>
                <span className="text-sm text-gray-600">
                  {craftVillage.yearsOfHistory > 0 ? `${craftVillage.yearsOfHistory} năm` : "Chưa cập nhật"}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-purple-200">
                <span className="text-sm font-medium text-gray-700">Workshop có sẵn:</span>
                <Badge className={craftVillage.workshopsAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {craftVillage.workshopsAvailable ? "Có sẵn" : "Không có"}
                </Badge>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-purple-200">
                <span className="text-sm font-medium text-gray-700">UNESCO công nhận:</span>
                <Badge className={craftVillage.isRecognizedByUnesco ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                  {craftVillage.isRecognizedByUnesco ? "Được công nhận" : "Chưa được công nhận"}
                </Badge>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-purple-800 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Thông tin liên hệ
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-white p-2 rounded border border-purple-200">
                  <Phone className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">{formatValue(craftVillage.phoneNumber)}</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded border border-purple-200">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">{formatValue(craftVillage.email)}</span>
                </div>
                {craftVillage.website && craftVillage.website !== "" ? (
                  <div className="flex items-center gap-2 bg-white p-2 rounded border border-purple-200">
                    <Globe className="w-4 h-4 text-purple-600" />
                    <a
                      href={craftVillage.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {craftVillage.website}
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-white p-2 rounded border border-purple-200">
                    <Globe className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-500">Chưa cập nhật</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historical Location Information */}
      {historicalLocation && (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Landmark className="w-5 h-5" />
              Thông tin di tích lịch sử
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Heritage Type */}
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <p className="font-medium text-gray-900">Phân loại di tích</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 text-sm">
                {getHistoricalType(historicalLocation.typeHistoricalLocation)}
              </Badge>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-blue-200">
                <span className="text-sm font-medium text-gray-700">Xếp hạng di sản:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rank) => (
                    <Star
                      key={rank}
                      className={`w-4 h-4 ${
                        rank <= (historicalLocation.heritageRank || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm font-medium ml-1">
                    {historicalLocation.heritageRank || 0}/5
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-blue-200">
                <span className="text-sm font-medium text-gray-700">Ngày thành lập:</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">
                    {formatDate(historicalLocation.establishedDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Historical Badge */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg text-center">
              <p className="text-white font-medium text-sm">🏛️ Di tích lịch sử có giá trị</p>
              <p className="text-blue-100 text-xs mt-1">Được bảo tồn và phát huy giá trị văn hóa</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
