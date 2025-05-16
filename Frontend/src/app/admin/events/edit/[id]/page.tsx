// "use client"

// import type React from "react"
// import '@ant-design/v5-patch-for-react-19';

// import { useEffect, useState, useRef } from "react"
// import { Form, Input, Upload, message, Spin, DatePicker, TimePicker, Switch, Radio } from "antd"
// import { PlusOutlined } from "@ant-design/icons"
// import { useDistrictManager } from "@/services/district-manager"
// import { useEventController } from "@/services/event-controller"
// import type { District } from "@/types/District"
// import type { TypeEvent, ListMedia } from "@/types/Event"
// import { Button } from "@/components/ui/button"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import { Separator } from "@/components/ui/separator"
// import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Loader2 } from "lucide-react"
// import { useParams, useRouter } from "next/navigation"
// import { Editor } from "@tinymce/tinymce-react"
// import dayjs from "dayjs"
// import "dayjs/locale/vi"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import { SeccretKey } from "@/secret/secret"
// import { addToast } from "@heroui/react"
// import { useLocationController } from "@/services/location-controller"
// import type { Location } from "@/types/Location"
// import { useForm } from "antd/es/form/Form"

// // Định nghĩa các mẫu lặp lại cho sự kiện
// const recurrencePatterns = [
//   { value: "Hăng tháng", label: "Hăng tháng" },
//   { value: "Một năm hai lần", label: "Một năm hai lần" },
//   { value: "Một năm một lần", label: "Một năm một lần" },
//   { value: "Hai năm một lần", label: "Hai năm một lần" },
// ]

// function EditEvent() {
//   const params = useParams()
//   const eventId = params.id as string

//   const [districts, setDistricts] = useState<District[]>([])
//   const [typeEvents, setTypeEvents] = useState<TypeEvent[]>([])
//   const [locations, setLocation] = useState<Location[]>([])
//   const [loading, setLoading] = useState(false)
//   const [eventLoading, setEventLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
//   const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
//   const [editorContent, setEditorContent] = useState("")
//   const [uploadedImages, setUploadedImages] = useState<Array<{ file: File; url: string }>>([])
//   const [existingMedia, setExistingMedia] = useState<ListMedia[]>([])
//   const [mediaToDelete, setMediaToDelete] = useState<string[]>([])
//   const [isRecurring, setIsRecurring] = useState(false)
//   const [useLunarCalendar, setUseLunarCalendar] = useState(false)
//   const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null)
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const [mediaToConfirmDelete, setMediaToConfirmDelete] = useState<string | null>(null)
//   const [patternSuggestions, setPatternSuggestions] = useState<string[]>([])
//   const [inputValue, setInputValue] = useState("")

//   const { getAllDistrict } = useDistrictManager()
//   const { getAllLocation } = useLocationController()
//   const { getAllTypeEvent, updateEvent, uploadEventMedia, uploadThumbnail, getEventById, deleteEventMedia } =
//     useEventController()

//   const [form] = useForm()
//   const router = useRouter()
//   const editorRef = useRef<any>(null)

//   // Track if component is mounted to prevent state updates after unmount
//   const isMounted = useRef(true)

//   useEffect(() => {
//     return () => {
//       isMounted.current = false
//     }
//   }, [])

//   const [initialFormValues, setInitialFormValues] = useState({});

//   // Fetch event data
//   useEffect(() => {
//     const fetchEventData = async () => {
//       if (!eventId) return

//       setEventLoading(true)
//       try {
//         const eventData = await getEventById(eventId)
//         console.log("Event data:", eventData);
//         if (eventData) {
//           setInitialFormValues(eventData)
//           // Set initial form values
//           // setInitialFormValues({
//           //   name: eventData.name,
//           //   description: eventData.description,
//           //   content: eventData.content,
//           //   rating: eventData.rating,
//           //   locationId: eventData.locationId,
//           //   typeEventId: eventData.typeEventId,
//           //   districtId: eventData.districtId,
//           //   isHighlighted: eventData.isHighlighted,
//           //   startDate: eventData.startDate ? dayjs(eventData.startDate) : null,
//           //   endDate: eventData.endDate ? dayjs(eventData.endDate) : null,
//           //   startTime: eventData.startTime ? dayjs(eventData.startTime, "HH:mm:ss") : null,
//           //   endTime: eventData.endTime ? dayjs(eventData.endTime, "HH:mm:ss") : null,
//           //   lunarStartDate: eventData.lunarStartDate || "",
//           //   lunarEndDate: eventData.lunarEndDate || "",
//           //   recurrencePattern: eventData.recurrencePattern,
//           // })
//           // Set form values
//             // Set form values
//             // form.setFieldsValue({
//             //   name: eventData.name,
//             //   description: eventData.description,
//             //   content: eventData.content,
//             //   typeEventId: eventData.typeEventId,
//             //   locationId: eventData.locationId,
//             //   districtId: eventData.districtId,
//             //   isHighlighted: eventData.isHighlighted,
//             //   startDate: eventData.startDate ? dayjs(eventData.startDate) : null,
//             //   endDate: eventData.endDate ? dayjs(eventData.endDate) : null,
//             //   startTime: eventData.startTime ? dayjs(eventData.startTime, "HH:mm:ss") : null,
//             //   endTime: eventData.endTime ? dayjs(eventData.endTime, "HH:mm:ss") : null,
//             //   lunarStartDate: eventData.lunarStartDate || "",
//             //   lunarEndDate: eventData.lunarEndDate || "",
//             //   recurrencePattern: eventData.recurrencePattern,
//             // });

//           // Set editor content
//           setEditorContent(eventData.content)

//           // Set state values
//           setIsRecurring(eventData.isRecurring)
//           setUseLunarCalendar(!!eventData.lunarStartDate || !!eventData.lunarEndDate)

//           // Nếu có recurrencePattern, cập nhật inputValue
//           if (eventData.recurrencePattern) {
//             setInputValue(eventData.recurrencePattern)
//           }

//           // Set existing media
//           if (eventData.medias && eventData.medias.length > 0) {
//             const thumbnail = eventData.medias.find((media: ListMedia) => media.isThumbnail)
//             if (thumbnail) {
//               setExistingThumbnail(thumbnail.mediaUrl)
//             }

//             setExistingMedia(eventData.medias)
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching event data:", error)
//         message.error("Không thể tải thông tin sự kiện. Vui lòng thử lại sau.")
//       } finally {
//         setEventLoading(false)
//       }
//     }

//     fetchEventData()
//   }, [eventId, getEventById, form])

//   // Fetch districts and event types
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true)
//       try {
//         const responseDistricts = await getAllDistrict()
//         const responseTypeEvents = await getAllTypeEvent()
//         const responseLocations = await getAllLocation()
//         setLocation(responseLocations)
//         setDistricts(responseDistricts)
//         setTypeEvents(responseTypeEvents)
//       } catch (error) {
//         console.error("Error fetching initial data:", error)
//         addToast({
//           title: "Không thể tải dữ liệu ban đầu. Vui lòng làm mới trang.",
//           description: error as string,
//           color: "danger",
//         })
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [getAllDistrict, getAllTypeEvent, getAllLocation])

//   // Xử lý khi người dùng nhập vào input
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value
//     setInputValue(value)
//     form.setFieldsValue({ recurrencePattern: value })

//     // Lọc gợi ý dựa trên giá trị nhập vào
//     if (value) {
//       const filtered = recurrencePatterns
//         .filter(
//           (pattern) =>
//             pattern.value.toLowerCase().includes(value.toLowerCase()) ||
//             pattern.label.toLowerCase().includes(value.toLowerCase()),
//         )
//         .map((pattern) => pattern.value)
//       setPatternSuggestions(filtered)
//     } else {
//       setPatternSuggestions([])
//     }
//   }

//   // Xử lý khi người dùng chọn một mẫu gợi ý
//   const handleSuggestionSelect = (pattern: string) => {
//     setInputValue(pattern)
//     form.setFieldsValue({ recurrencePattern: pattern })
//     setPatternSuggestions([])
//   }

//   // Handle image upload for the editor
//   const handleEditorImageUpload = (callback: Function, value: any, meta: any) => {
//     // Create a file input element
//     const input = document.createElement("input")
//     input.setAttribute("type", "file")
//     input.setAttribute("accept", "image/*")

//     input.onchange = async () => {
//       if (input.files && input.files[0]) {
//         const file = input.files[0]

//         // Create a blob URL for the image
//         const blobUrl = URL.createObjectURL(file)

//         // Add to uploaded images array
//         setUploadedImages((prev) => [...prev, { file, url: blobUrl }])

//         // Call the callback with the URL
//         callback(blobUrl, { title: file.name })
//       }
//     }

//     input.click()
//   }

//   // Handle form submission
//   const onFinish = async (values: any) => {
//     setSubmitting(true)
//     console.log("Form values submit=================:", values);
//     console.log("Form values:", values)
    
//     try {
//       // Get content from editor
//       const content = editorRef.current ? editorRef.current.getContent() : ""

//       console.log("Editor content:", content);
      
//       // Format dates and times
//       const formattedValues = {
//         ...values,
//         name: values.name,
//         id: eventId,
//         content,
//         startDate: values.startDate?.format("YYYY-MM-DD"),
//         endDate: values.endDate?.format("YYYY-MM-DD"),
//         startTime: values.startTime?.format("HH:mm:ss"),
//         endTime: values.endTime?.format("HH:mm:ss"),
//         lunarStartDate: useLunarCalendar && values.lunarStartDate ? values.lunarStartDate : null,
//         lunarEndDate: useLunarCalendar && values.lunarEndDate ? values.lunarEndDate : null,
//         isRecurring: isRecurring,
//         recurrencePattern: isRecurring ? values.recurrencePattern : null,
//         rating: values.rating?.toString() || "0",
//       }


//       // Check if thumbnail file is selected
//       console.log("Format values:", formattedValues)
//       // Update event
//       const response = await updateEvent(formattedValues.id, formattedValues)

//       console.log("Event updated successfully:", response)
//       // Handle media deletions
//       //   if (mediaToDelete.length > 0) {
//       //     for (const mediaId of mediaToDelete) {
//       //       await deleteEventMedia(mediaId)
//       //     }
//       //   }

//       // Upload new media files
//       if (uploadedFiles.length > 0 || uploadedImages.length > 0) {
//         // Combine all uploaded files
//         const allFiles = [...uploadedFiles, ...uploadedImages.map((img) => img.file)]

//         await uploadEventMedia(eventId, allFiles)
//       }

//       // Upload thumbnail if exists
//       if (thumbnailFile) {
//         await uploadThumbnail(eventId, thumbnailFile)
//       }

//       message.success("Cập nhật sự kiện thành công!")
//       router.push("/admin/events/lists")
//     } catch (error) {
//       console.error("Error updating event:", error)
//       message.error("Không thể cập nhật sự kiện. Vui lòng thử lại sau.")
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   // Handle file uploads
//   const handleFileChange = (info: any) => {
//     const files = info.fileList.filter((file: any) => file.originFileObj).map((file: any) => file.originFileObj)
//     setUploadedFiles(files)
//   }

//   const normFile = (e: any) => {
//     if (Array.isArray(e)) {
//       return e
//     }
//     return e?.fileList
//   }

//   const handleThumbnailChange = (info: any) => {
//     const file = info.fileList[0]?.originFileObj
//     setThumbnailFile(file)
//   }

//   // Handle media deletion
//   const handleConfirmDeleteMedia = (mediaId: string) => {
//     setMediaToConfirmDelete(mediaId)
//     setDeleteDialogOpen(true)
//   }

//   const handleDeleteMedia = () => {
//     if (mediaToConfirmDelete) {
//       setMediaToDelete((prev) => [...prev, mediaToConfirmDelete])
//       setExistingMedia((prev) => prev.filter((media) => media.mediaUrl !== mediaToConfirmDelete))
//       setDeleteDialogOpen(false)
//       setMediaToConfirmDelete(null)
//     }
//   }

//   // Show loading overlay when loading event data
//   if (eventLoading) {
//     return (
//       <SidebarInset>
//         <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
//           <SidebarTrigger className="-ml-1" />
//           <Separator orientation="vertical" className="mr-2 h-4" />
//           <Breadcrumb>
//             <BreadcrumbList>
//               <BreadcrumbItem className="hidden md:block">
//                 <BreadcrumbLink href="#">Quản lý sự kiện</BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator className="hidden md:block" />
//               <BreadcrumbItem>
//                 <BreadcrumbLink href="/admin/events/lists">Danh sách sự kiện</BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator className="hidden md:block" />
//               <BreadcrumbItem>
//                 <BreadcrumbPage>Chỉnh sửa sự kiện</BreadcrumbPage>
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>
//         </header>
//         <div className="flex items-center justify-center h-[calc(100vh-64px)]">
//           <Spin size="large" />
//           <span className="ml-2">Đang tải thông tin sự kiện...</span>
//         </div>
//       </SidebarInset>
//     )
//   }

//   // Show loading overlay when submitting form
//   if (submitting) {
//     return (
//       <SidebarInset>
//         <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
//           <SidebarTrigger className="-ml-1" />
//           <Separator orientation="vertical" className="mr-2 h-4" />
//           <Breadcrumb>
//             <BreadcrumbList>
//               <BreadcrumbItem className="hidden md:block">
//                 <BreadcrumbLink href="#">Quản lý sự kiện</BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator className="hidden md:block" />
//               <BreadcrumbItem>
//                 <BreadcrumbLink href="/admin/events/lists">Danh sách sự kiện</BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator className="hidden md:block" />
//               <BreadcrumbItem>
//                 <BreadcrumbPage>Chỉnh sửa sự kiện</BreadcrumbPage>
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>
//         </header>
//         <div className="flex items-center justify-center h-[calc(100vh-64px)]">
//           <Spin size="large" />
//           <span className="ml-2">Đang cập nhật sự kiện...</span>
//         </div>
//       </SidebarInset>
//     )
//   }

//   return (
//     <SidebarInset>
//       <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
//         <SidebarTrigger className="-ml-1" />
//         <Separator orientation="vertical" className="mr-2 h-4" />
//         <Breadcrumb>
//           <BreadcrumbList>
//             <BreadcrumbItem className="hidden md:block">
//               <BreadcrumbLink href="#">Quản lý sự kiện</BreadcrumbLink>
//             </BreadcrumbItem>
//             <BreadcrumbSeparator className="hidden md:block" />
//             <BreadcrumbItem>
//               <BreadcrumbLink href="/admin/events/lists">Danh sách sự kiện</BreadcrumbLink>
//             </BreadcrumbItem>
//             <BreadcrumbSeparator className="hidden md:block" />
//             <BreadcrumbItem>
//               <BreadcrumbPage>Chỉnh sửa sự kiện</BreadcrumbPage>
//             </BreadcrumbItem>
//           </BreadcrumbList>
//         </Breadcrumb>
//       </header>
//       <div className="p-1 flex flex-1 flex-col gap-4 items-center w-full h-fit">
//         <Form
//           layout="vertical"
//           form={form}
//           onFinish={onFinish}
//           style={{ maxWidth: 1200 }}
//           className="bg-white w-full p-6 rounded-lg shadow-md"
//           initialValues={initialFormValues}
//         >
//           <Tabs defaultValue="basic" className="w-full">
//             <TabsList className="grid w-full grid-cols-3">
//               <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
//               <TabsTrigger value="content">Nội dung & Hình ảnh</TabsTrigger>
//               <TabsTrigger value="schedule">Lịch trình</TabsTrigger>
//             </TabsList>

//             {/* Tab thông tin cơ bản */}
//             <TabsContent value="basic">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <div>
//                   <Form.Item
//                     label="Tên sự kiện"
//                     name="name"
//                     rules={[{ required: true, message: "Vui lòng nhập tên sự kiện!" }]}
//                   >
//                     <Input placeholder="Nhập tên sự kiện" />
//                   </Form.Item>

//                   <Form.Item
//                     label="Mô tả ngắn"
//                     name="description"
//                     rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
//                   >
//                     <Input.TextArea placeholder="Nhập mô tả ngắn gọn" rows={4} />
//                   </Form.Item>

//                   <Form.Item
//                     label="Loại sự kiện"
//                     name="typeEventId"
//                     rules={[
//                       {
//                         required: true,
//                         message: "Vui lòng chọn loại sự kiện!",
//                       },
//                     ]}
//                   >
//                     <Select
//                       // onValueChange={(value) => form.setFieldsValue({ typeEventId: value })}
//                       // defaultValue={form.getFieldValue("typeEventId")}
//                       onValueChange={(value) => form.setFieldsValue({ typeEventId: value })}
//                     >
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Chọn loại sự kiện" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {loading ? (
//                           <div className="flex items-center justify-center py-2">
//                             <Loader2 className="h-4 w-4 animate-spin" />
//                             <span className="ml-2">Đang tải...</span>
//                           </div>
//                         ) : (
//                           typeEvents.map((type) => (
//                             <SelectItem key={type.id} value={type.id}>
//                               {type.typeName}
//                             </SelectItem>
//                           ))
//                         )}
//                       </SelectContent>
//                     </Select>
//                   </Form.Item>
//                 </div>

//                 <div>
//                   <Form.Item label="Địa điểm" name="locationId" rules={[{ message: "Vui lòng chọn địa điểm!" }]}>
//                     <Select
//                       // onValueChange={(value) => form.setFieldsValue({ locationId: value })}
//                       // defaultValue={form.getFieldValue("locationId")}
//                       onValueChange={(value) => form.setFieldsValue({ locationId: value })}
//                     >
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Chọn địa điểm" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {loading ? (
//                           <div className="flex items-center justify-center py-2">
//                             <Loader2 className="h-4 w-4 animate-spin" />
//                             <span className="ml-2">Đang tải...</span>
//                           </div>
//                         ) : (
//                           locations.map((location: Location) => (
//                             <SelectItem key={location.id} value={location.id}>
//                               {location.name}
//                             </SelectItem>
//                           ))
//                         )}
//                       </SelectContent>
//                     </Select>
//                   </Form.Item>

//                   <Form.Item
//                     label="Quận/Huyện"
//                     name="districtId"
//                     rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
//                   >
//                     <Select
//                       // onValueChange={(value) => form.setFieldsValue({ districtId: value })}
//                       // defaultValue={form.getFieldValue("districtId")}
//                       onValueChange={(value) => form.setFieldsValue({ districtId: value })}
//                     >
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Chọn quận/huyện" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {loading ? (
//                           <div className="flex items-center justify-center py-2">
//                             <Loader2 className="h-4 w-4 animate-spin" />
//                             <span className="ml-2">Đang tải...</span>
//                           </div>
//                         ) : (
//                           districts.map((district) => (
//                             <SelectItem key={district.id} value={district.id}>
//                               {district.name}
//                             </SelectItem>
//                           ))
//                         )}
//                       </SelectContent>
//                     </Select>
//                   </Form.Item>

//                   <Form.Item label="Sự kiện nổi bật" name="isHighlighted" valuePropName="checked">
//                     <Switch />
//                   </Form.Item>
//                 </div>
//               </div>
//             </TabsContent>

//             {/* Tab nội dung và hình ảnh */}
//             <TabsContent value="content">
//               <div className="space-y-6">
//                 <div className="mb-4">
//                   <Label className="mb-2 block">Nội dung chi tiết</Label>
//                   <Editor
//                     apiKey={SeccretKey.TINYMCE_API_KEY}
//                     onInit={(evt, editor) => (editorRef.current = editor)}
//                     initialValue={editorContent}
//                     init={{
//                       height: 500,
//                       menubar: true,
//                       plugins: [
//                         "advlist",
//                         "autolink",
//                         "lists",
//                         "link",
//                         "image",
//                         "charmap",
//                         "preview",
//                         "anchor",
//                         "searchreplace",
//                         "visualblocks",
//                         "code",
//                         "fullscreen",
//                         "insertdatetime",
//                         "media",
//                         "table",
//                         "code",
//                         "help",
//                         "wordcount",
//                       ],
//                       toolbar:
//                         "undo redo | blocks | " +
//                         "bold italic forecolor | alignleft aligncenter " +
//                         "alignright alignjustify | bullist numlist outdent indent | " +
//                         "removeformat | image | help",
//                       content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
//                       file_picker_types: "image",
//                       file_picker_callback: handleEditorImageUpload,
//                       images_upload_handler: handleEditorImageUpload,
//                     }}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     {/* Existing Thumbnail */}
//                     {existingThumbnail && (
//                       <div className="mb-4">
//                         <Label className="mb-2 block">Hình ảnh Thumbnail hiện tại</Label>
//                         <div className="relative w-32 h-32 border rounded-md overflow-hidden group">
//                           <img
//                             src={existingThumbnail || "/placeholder.svg"}
//                             alt="Thumbnail"
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                       </div>
//                     )}

//                     <Form.Item label="Cập nhật Thumbnail" valuePropName="fileList" getValueFromEvent={normFile}>
//                       <Upload
//                         accept="image/*"
//                         listType="picture-card"
//                         beforeUpload={() => false}
//                         onChange={handleThumbnailChange}
//                         showUploadList={{
//                           showRemoveIcon: true,
//                           showPreviewIcon: false,
//                         }}
//                         maxCount={1}
//                       >
//                         <button
//                           style={{
//                             color: "inherit",
//                             cursor: "inherit",
//                             border: 0,
//                             background: "none",
//                           }}
//                           type="button"
//                         >
//                           <PlusOutlined />
//                           <div style={{ marginTop: 8 }}>Cập nhật Thumbnail</div>
//                         </button>
//                       </Upload>
//                     </Form.Item>
//                   </div>

//                   <div>
//                     <Form.Item label="Tải lên hình ảnh bổ sung" valuePropName="fileList" getValueFromEvent={normFile}>
//                       <Upload multiple listType="picture-card" beforeUpload={() => false} onChange={handleFileChange}>
//                         <button
//                           style={{
//                             color: "inherit",
//                             cursor: "inherit",
//                             border: 0,
//                             background: "none",
//                           }}
//                           type="button"
//                         >
//                           <PlusOutlined />
//                           <div style={{ marginTop: 8 }}>Tải lên</div>
//                         </button>
//                       </Upload>
//                     </Form.Item>
//                   </div>
//                 </div>

//                 {/* Existing Media */}
//                 {existingMedia.length > 0 && (
//                   <Card>
//                     <CardContent className="pt-6">
//                       <h3 className="text-lg font-medium mb-4">Hình ảnh hiện có</h3>
//                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                         {existingMedia
//                           .filter((media) => !media.isThumbnail)
//                           .map((media, index) => (
//                             <div key={index} className="relative group">
//                               <img
//                                 src={media.mediaUrl || "/placeholder.svg"}
//                                 alt={`Media ${index}`}
//                                 className="w-full h-24 object-cover rounded-md"
//                               />
//                               <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
//                                 <div className="flex space-x-2">
//                                   <button
//                                     type="button"
//                                     onClick={() => {
//                                       // Copy image URL to clipboard for easy insertion
//                                       navigator.clipboard.writeText(media.mediaUrl)
//                                       message.success("Đã sao chép URL hình ảnh vào clipboard")
//                                     }}
//                                     className="bg-white text-black rounded-full p-1 text-xs"
//                                   >
//                                     Sao chép URL
//                                   </button>
//                                   <button
//                                     type="button"
//                                     onClick={() => handleConfirmDeleteMedia(media.mediaUrl)}
//                                     className="bg-red-500 text-white rounded-full p-1 text-xs"
//                                   >
//                                     Xóa
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                       </div>
//                       <p className="text-sm text-gray-500 mt-4">
//                         Nhấp vào "Sao chép URL" và dán vào trình soạn thảo để chèn hình ảnh vào vị trí mong muốn.
//                       </p>
//                     </CardContent>
//                   </Card>
//                 )}

//                 {uploadedImages.length > 0 && (
//                   <Card>
//                     <CardContent className="pt-6">
//                       <h3 className="text-lg font-medium mb-4">Hình ảnh mới đã tải lên cho nội dung</h3>
//                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                         {uploadedImages.map((img, index) => (
//                           <div key={index} className="relative group">
//                             <img
//                               src={img.url || "/placeholder.svg"}
//                               alt={`Uploaded ${index}`}
//                               className="w-full h-24 object-cover rounded-md"
//                             />
//                             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
//                               <button
//                                 type="button"
//                                 onClick={() => {
//                                   // Copy image URL to clipboard for easy insertion
//                                   navigator.clipboard.writeText(img.url)
//                                   message.success("Đã sao chép URL hình ảnh vào clipboard")
//                                 }}
//                                 className="bg-white text-black rounded-full p-1 text-xs"
//                               >
//                                 Sao chép URL
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                       <p className="text-sm text-gray-500 mt-4">
//                         Nhấp vào "Sao chép URL" và dán vào trình soạn thảo để chèn hình ảnh vào vị trí mong muốn.
//                       </p>
//                     </CardContent>
//                   </Card>
//                 )}
//               </div>
//             </TabsContent>

//             {/* Tab lịch trình */}
//             <TabsContent value="schedule">
//               <div className="space-y-6">
//                 <div className="flex items-center space-x-2">
//                   <Label>Loại lịch:</Label>
//                   <Radio.Group
//                     value={useLunarCalendar ? "lunar" : "solar"}
//                     onChange={(e) => setUseLunarCalendar(e.target.value === "lunar")}
//                   >
//                     <Radio value="solar">Dương lịch</Radio>
//                     <Radio value="lunar">Âm lịch</Radio>
//                   </Radio.Group>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <Form.Item
//                       label={useLunarCalendar ? "Ngày bắt đầu (Dương lịch)" : "Ngày bắt đầu"}
//                       name="startDate"
//                       rules={[
//                         {
//                           required: true,
//                           message: "Vui lòng chọn ngày bắt đầu!",
//                         },
//                       ]}
//                     >
//                       <DatePicker className="w-full" format="DD/MM/YYYY" placeholder="Chọn ngày bắt đầu" />
//                     </Form.Item>

//                     {useLunarCalendar && (
//                       <Form.Item label="Ngày bắt đầu (Âm lịch)" name="lunarStartDate">
//                         <Input placeholder="Nhập ngày bắt đầu âm lịch (VD: 15/01/2023)" />
//                       </Form.Item>
//                     )}

//                     <Form.Item
//                       label="Giờ bắt đầu"
//                       name="startTime"
//                       rules={[
//                         {
//                           required: true,
//                           message: "Vui lòng chọn giờ bắt đầu!",
//                         },
//                       ]}
//                     >
//                       <TimePicker className="w-full" format="HH:mm" placeholder="Chọn giờ bắt đầu" />
//                     </Form.Item>
//                   </div>

//                   <div>
//                     <Form.Item
//                       label={useLunarCalendar ? "Ngày kết thúc (Dương lịch)" : "Ngày kết thúc"}
//                       name="endDate"
//                       rules={[
//                         {
//                           required: true,
//                           message: "Vui lòng chọn ngày kết thúc!",
//                         },
//                       ]}
//                     >
//                       <DatePicker className="w-full" format="DD/MM/YYYY" placeholder="Chọn ngày kết thúc" />
//                     </Form.Item>

//                     {useLunarCalendar && (
//                       <Form.Item label="Ngày kết thúc (Âm lịch)" name="lunarEndDate">
//                         <Input placeholder="Nhập ngày kết thúc âm lịch (VD: 20/01/2023)" />
//                       </Form.Item>
//                     )}

//                     <Form.Item
//                       label="Giờ kết thúc"
//                       name="endTime"
//                       rules={[
//                         {
//                           required: true,
//                           message: "Vui lòng chọn giờ kết thúc!",
//                         },
//                       ]}
//                     >
//                       <TimePicker className="w-full" format="HH:mm" placeholder="Chọn giờ kết thúc" />
//                     </Form.Item>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-2">
//                     <Switch checked={isRecurring} onChange={(checked) => setIsRecurring(checked)} />
//                     <Label>Sự kiện lặp lại</Label>
//                   </div>

//                   {isRecurring && (
//                     <div>
//                       <Form.Item
//                         label="Mẫu lặp lại"
//                         name="recurrencePattern"
//                         rules={[
//                           {
//                             required: isRecurring,
//                             message: "Vui lòng nhập mẫu lặp lại!",
//                           },
//                         ]}
//                       >
//                         <Input
//                           placeholder="Nhập mẫu lặp lại"
//                           value={inputValue}
//                           onChange={handleInputChange}
//                         />
//                       </Form.Item>

//                       {/* Hiển thị gợi ý */}
//                       {patternSuggestions.length > 0 && (
//                         <div className="mb-4 bg-white border rounded-md shadow-sm">
//                           <div className="p-2 text-sm text-gray-500">Gợi ý:</div>
//                           <ul className="max-h-40 overflow-y-auto">
//                             {patternSuggestions.map((pattern) => (
//                               <li
//                                 key={pattern}
//                                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                 onClick={() => handleSuggestionSelect(pattern)}
//                               >
//                                 {pattern} - {recurrencePatterns.find((p) => p.value === pattern)?.label}
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       )}

//                       {/* Hiển thị gợi ý mẫu */}
//                       <div className="mt-2 text-sm text-gray-500">
//                         <p>Các mẫu lặp lại phổ biến:</p>
//                         <ul className="mt-1 space-y-1">
//                           {recurrencePatterns.map((pattern) => (
//                             <li key={pattern.value} className="flex">
//                               <span
//                                 className="text-blue-500 cursor-pointer hover:underline"
//                                 onClick={() => {
//                                   setInputValue(pattern.value)
//                                   form.setFieldsValue({ recurrencePattern: pattern.value })
//                                 }}
//                               >
//                                 {pattern.value}
//                               </span>
//                               <span className="ml-2">- {pattern.label}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>

//           <div className="flex gap-4 justify-end mt-6">
//             <Button variant="outline" type="button" onClick={() => router.push("/admin/events/lists")}>
//               Hủy
//             </Button>
//             <Button variant="default" type="submit" className="bg-blue-500 text-white" disabled={submitting}>
//               {submitting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Đang cập nhật...
//                 </>
//               ) : (
//                 "Cập nhật"
//               )}
//             </Button>
//           </div>
//         </Form>
//       </div>

//       {/* Confirm delete dialog */}
//       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Xác nhận xóa hình ảnh</AlertDialogTitle>
//             <AlertDialogDescription>
//               Bạn có chắc chắn muốn xóa hình ảnh này? Hành động này không thể hoàn tác.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Hủy</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDeleteMedia} className="bg-red-500 text-white hover:bg-red-600">
//               Xóa
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </SidebarInset>
//   )
// }

// export default EditEvent


"use client"

import type React from "react"
import "@ant-design/v5-patch-for-react-19"

import { useEffect, useState, useRef } from "react"
import { Form, Input, Upload, message, Spin, DatePicker, TimePicker, Switch, Radio } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { useDistrictManager } from "@/services/district-manager"
import type { District } from "@/types/District"
import type { TypeEvent, ListMedia, Event } from "@/types/Event"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Editor } from "@tinymce/tinymce-react"
import dayjs from "dayjs"
import "dayjs/locale/vi"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SeccretKey } from "@/secret/secret"
import { addToast } from "@heroui/react"
import { useLocationController } from "@/services/location-controller"
import type { Location } from "@/types/Location"
import { useForm } from "antd/es/form/Form"
import { useEventController } from "@/services/event-controller"

// Định nghĩa các mẫu lặp lại cho sự kiện
const recurrencePatterns = [
  { value: "Hăng tháng", label: "Hăng tháng" },
  { value: "Một năm hai lần", label: "Một năm hai lần" },
  { value: "Một năm một lần", label: "Một năm một lần" },
  { value: "Hai năm một lần", label: "Hai năm một lần" },
]

function EditEvent() {
  const params = useParams()
  const eventId = params.id as string

  const [districts, setDistricts] = useState<District[]>([])
  const [typeEvents, setTypeEvents] = useState<TypeEvent[]>([])
  const [locations, setLocation] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [eventLoading, setEventLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [editorContent, setEditorContent] = useState("")
  const [uploadedImages, setUploadedImages] = useState<Array<{ file: File; url: string }>>([])
  const [existingMedia, setExistingMedia] = useState<ListMedia[]>([])
  const [mediaToDelete, setMediaToDelete] = useState<string[]>([])
  const [isRecurring, setIsRecurring] = useState(false)
  const [useLunarCalendar, setUseLunarCalendar] = useState(false)
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [mediaToConfirmDelete, setMediaToConfirmDelete] = useState<string | null>(null)
  const [patternSuggestions, setPatternSuggestions] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")

  const { getAllDistrict } = useDistrictManager()
  const { getAllLocation } = useLocationController()
  const { getAllTypeEvent, updateEvent, uploadEventMedia, uploadThumbnail, getEventById, deleteEventMedia } =
    useEventController()

  const [form] = useForm()
  const router = useRouter()
  const editorRef = useRef<any>(null)

  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const [initialFormValues, setInitialFormValues] = useState<Event>()

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) return

      setEventLoading(true)
      try {
        const eventData = await getEventById(eventId)
        console.log("Event data:", eventData)
        if (eventData) {
          // Store the original event data
          setInitialFormValues(eventData)

          // Set form values with all fields
          form.setFieldsValue({
            name: eventData.name,
            description: eventData.description,
            content: eventData.content,
            typeEventId: eventData.typeEventId,
            locationId: eventData.locationId,
            districtId: eventData.districtId,
            isHighlighted: eventData.isHighlighted,
            startDate: eventData.startDate ? dayjs(eventData.startDate) : null,
            endDate: eventData.endDate ? dayjs(eventData.endDate) : null,
            startTime: eventData.startTime ? dayjs(eventData.startTime, "HH:mm:ss") : null,
            endTime: eventData.endTime ? dayjs(eventData.endTime, "HH:mm:ss") : null,
            lunarStartDate: eventData.lunarStartDate || "",
            lunarEndDate: eventData.lunarEndDate || "",
            recurrencePattern: eventData.recurrencePattern,
            rating: eventData.rating?.toString() || "0",
          })

          // Set editor content
          setEditorContent(eventData.content)

          // Set state values
          setIsRecurring(eventData.isRecurring)
          setUseLunarCalendar(!!eventData.lunarStartDate || !!eventData.lunarEndDate)

          // Nếu có recurrencePattern, cập nhật inputValue
          if (eventData.recurrencePattern) {
            setInputValue(eventData.recurrencePattern)
          }

          // Set existing media
          if (eventData.medias && eventData.medias.length > 0) {
            const thumbnail = eventData.medias.find((media: ListMedia) => media.isThumbnail)
            if (thumbnail) {
              setExistingThumbnail(thumbnail.mediaUrl)
            }

            setExistingMedia(eventData.medias)
          }
        }
      } catch (error) {
        console.error("Error fetching event data:", error)
        message.error("Không thể tải thông tin sự kiện. Vui lòng thử lại sau.")
      } finally {
        setEventLoading(false)
      }
    }

    fetchEventData()
  }, [eventId, getEventById, form])

  // Fetch districts and event types
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const responseDistricts = await getAllDistrict()
        const responseTypeEvents = await getAllTypeEvent()
        const responseLocations = await getAllLocation()
        setLocation(responseLocations)
        setDistricts(responseDistricts)
        setTypeEvents(responseTypeEvents)
      } catch (error) {
        console.error("Error fetching initial data:", error)
        addToast({
          title: "Không thể tải dữ liệu ban đầu. Vui lòng làm mới trang.",
          description: error as string,
          color: "danger",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [getAllDistrict, getAllTypeEvent, getAllLocation])

  // Xử lý khi người dùng nhập vào input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    form.setFieldsValue({ recurrencePattern: value })

    // Lọc gợi ý dựa trên giá trị nhập vào
    if (value) {
      const filtered = recurrencePatterns
        .filter(
          (pattern) =>
            pattern.value.toLowerCase().includes(value.toLowerCase()) ||
            pattern.label.toLowerCase().includes(value.toLowerCase()),
        )
        .map((pattern) => pattern.value)
      setPatternSuggestions(filtered)
    } else {
      setPatternSuggestions([])
    }
  }

  // Xử lý khi người dùng chọn một mẫu gợi ý
  const handleSuggestionSelect = (pattern: string) => {
    setInputValue(pattern)
    form.setFieldsValue({ recurrencePattern: pattern })
    setPatternSuggestions([])
  }

  // Handle image upload for the editor
  const handleEditorImageUpload = (callback: Function, value: any, meta: any) => {
    // Create a file input element
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0]

        // Create a blob URL for the image
        const blobUrl = URL.createObjectURL(file)

        // Add to uploaded images array
        setUploadedImages((prev) => [...prev, { file, url: blobUrl }])

        // Call the callback with the URL
        callback(blobUrl, { title: file.name })
      }
    }

    input.click()
  }

  // Handle form submission
  const onFinish = async (values: any) => {
    setSubmitting(true)
    console.log("Form values submit=================:", values)
    const contentSubmit = editorRef.current ? editorRef.current.getContent() : values.content || ""
    console.log("Editor content:", contentSubmit);

    // Validate required fields
    if (!values.name) {
      values.name = initialFormValues?.name // Use the original name if not provided
      // message.error("Tên sự kiện không được để trống!")
      // setSubmitting(false)
      // return
    }

    try {
      // Get content from editor
      
      // Format dates and times
      const formattedValues = {
        id: eventId,
        name: values.name, // Ensure name is included and properly capitalized
        description: values.description || initialFormValues?.description, // Ensure description is included
        content: contentSubmit || initialFormValues?.content, // Use the content from the editor
        typeEventId: values.typeEventId || initialFormValues?.typeEventId,
        locationId: values.locationId || initialFormValues?.locationId,
        districtId: values.districtId || initialFormValues?.districtId,
        isHighlighted: values.isHighlighted || initialFormValues?.isHighlighted,
        startDate: values.startDate?.format("YYYY-MM-DD") || initialFormValues?.startDate,
        endDate: values.endDate?.format("YYYY-MM-DD") || initialFormValues?.endDate,
        startTime: values.startTime?.format("HH:mm:ss") || initialFormValues?.startTime,
        endTime: values.endTime?.format("HH:mm:ss") || initialFormValues?.endTime,
        lunarStartDate: useLunarCalendar && values.lunarStartDate ? values.lunarStartDate : initialFormValues?.lunarStartDate,
        lunarEndDate: useLunarCalendar && values.lunarEndDate ? values.lunarEndDate : initialFormValues?.lunarEndDate,
        isRecurring: isRecurring,
        recurrencePattern: isRecurring ? values.recurrencePattern : initialFormValues?.recurrencePattern,
        rating: values.rating?.toString() || initialFormValues?.rating?.toString() || "0",
      }

      // Log the formatted values to verify all required fields are present
      console.log("Formatted values with Name field:", formattedValues)

      // Update event
      const response = await updateEvent(formattedValues.id, formattedValues)
      console.log("Event updated successfully:", response)

      // Handle media deletions
      if (mediaToDelete.length > 0) {
        for (const mediaId of mediaToDelete) {
          await deleteEventMedia(mediaId)
        }
      }

      // Upload new media files
      if (uploadedFiles.length > 0 || uploadedImages.length > 0) {
        // Combine all uploaded files
        const allFiles = [...uploadedFiles, ...uploadedImages.map((img) => img.file)]
        await uploadEventMedia(eventId, allFiles)
      }

      // Upload thumbnail if exists
      if (thumbnailFile) {
        await uploadThumbnail(eventId, thumbnailFile)
      }

      message.success("Cập nhật sự kiện thành công!")
      router.push("/admin/events/lists")
    } catch (error) {
      console.error("Error updating event:", error)
      message.error("Không thể cập nhật sự kiện. Vui lòng thử lại sau.")
    } finally {
      setSubmitting(false)
    }
  }

  // Handle file uploads
  const handleFileChange = (info: any) => {
    const files = info.fileList.filter((file: any) => file.originFileObj).map((file: any) => file.originFileObj)
    setUploadedFiles(files)
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  const handleThumbnailChange = (info: any) => {
    const file = info.fileList[0]?.originFileObj
    setThumbnailFile(file)
  }

  // Handle media deletion
  const handleConfirmDeleteMedia = (mediaId: string) => {
    setMediaToConfirmDelete(mediaId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteMedia = () => {
    if (mediaToConfirmDelete) {
      setMediaToDelete((prev) => [...prev, mediaToConfirmDelete])
      setExistingMedia((prev) => prev.filter((media) => media.mediaUrl !== mediaToConfirmDelete))
      setDeleteDialogOpen(false)
      setMediaToConfirmDelete(null)
    }
  }

  // Handle shadcn/ui Select changes
  const handleSelectChange = (field: string, value: any) => {
    form.setFieldsValue({ [field]: value })
  }

  // Show loading overlay when loading event data
  if (eventLoading) {
    return (
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý sự kiện</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/events/lists">Danh sách sự kiện</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Chỉnh sửa sự kiện</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Spin size="large" />
          <span className="ml-2">Đang tải thông tin sự kiện...</span>
        </div>
      </SidebarInset>
    )
  }

  // Show loading overlay when submitting form
  if (submitting) {
    return (
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý sự kiện</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/events/lists">Danh sách sự kiện</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Chỉnh sửa sự kiện</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Spin size="large" />
          <span className="ml-2">Đang cập nhật sự kiện...</span>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Quản lý sự kiện</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/events/lists">Danh sách sự kiện</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Chỉnh sửa sự kiện</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="p-1 flex flex-1 flex-col gap-4 items-center w-full h-fit">
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          style={{ maxWidth: 1200 }}
          className="bg-white w-full p-6 rounded-lg shadow-md"
          initialValues={initialFormValues}
        >
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="content">Nội dung & Hình ảnh</TabsTrigger>
              <TabsTrigger value="schedule">Lịch trình</TabsTrigger>
            </TabsList>

            {/* Tab thông tin cơ bản */}
            <TabsContent value="basic">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <Form.Item
                    label="Tên sự kiện"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên sự kiện!" }]}
                  >
                    <Input placeholder="Nhập tên sự kiện" />
                  </Form.Item>

                  <Form.Item
                    label="Mô tả ngắn"
                    name="description"
                    rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                  >
                    <Input.TextArea placeholder="Nhập mô tả ngắn gọn" rows={4} />
                  </Form.Item>

                  <Form.Item
                    label="Loại sự kiện"
                    name="typeEventId"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn loại sự kiện!",
                      },
                    ]}
                  >
                    <Select
                      onValueChange={(value) => handleSelectChange("typeEventId", value)}
                      defaultValue={form.getFieldValue("typeEventId")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn loại sự kiện" />
                      </SelectTrigger>
                      <SelectContent>
                        {loading ? (
                          <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2">Đang tải...</span>
                          </div>
                        ) : (
                          typeEvents.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.typeName}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </Form.Item>
                </div>

                <div>
                  <Form.Item label="Địa điểm" name="locationId" rules={[{ message: "Vui lòng chọn địa điểm!" }]}>
                    <Select
                      onValueChange={(value) => handleSelectChange("locationId", value)}
                      defaultValue={form.getFieldValue("locationId")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn địa điểm" />
                      </SelectTrigger>
                      <SelectContent>
                        {loading ? (
                          <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2">Đang tải...</span>
                          </div>
                        ) : (
                          locations.map((location: Location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Quận/Huyện"
                    name="districtId"
                    rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
                  >
                    <Select
                      onValueChange={(value) => handleSelectChange("districtId", value)}
                      defaultValue={form.getFieldValue("districtId")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        {loading ? (
                          <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2">Đang tải...</span>
                          </div>
                        ) : (
                          districts.map((district) => (
                            <SelectItem key={district.id} value={district.id}>
                              {district.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Sự kiện nổi bật" name="isHighlighted" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </div>
              </div>
            </TabsContent>

            {/* Tab nội dung và hình ảnh */}
            <TabsContent value="content">
              <div className="space-y-6">
                <div className="mb-4">
                  <Label className="mb-2 block">Nội dung chi tiết</Label>
                  <Form.Item name="content" hidden>
                    <Input />
                  </Form.Item>
                  <Editor
                    apiKey={SeccretKey.TINYMCE_API_KEY}
                    onInit={(evt, editor) => {
                      editorRef.current = editor
                      // Update form content field when editor is initialized
                      form.setFieldsValue({ content: editor.getContent() })
                    }}
                    initialValue={editorContent}
                    onEditorChange={(content) => {
                      // Update form content field when editor content changes
                      form.setFieldsValue({ content: content })
                    }}
                    init={{
                      height: 500,
                      menubar: true,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "code",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | image | help",
                      content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                      file_picker_types: "image",
                      file_picker_callback: handleEditorImageUpload,
                      images_upload_handler: handleEditorImageUpload,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {/* Existing Thumbnail */}
                    {existingThumbnail && (
                      <div className="mb-4">
                        <Label className="mb-2 block">Hình ảnh Thumbnail hiện tại</Label>
                        <div className="relative w-32 h-32 border rounded-md overflow-hidden group">
                          <img
                            src={existingThumbnail || "/placeholder.svg"}
                            alt="Thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <Form.Item label="Cập nhật Thumbnail" valuePropName="fileList" getValueFromEvent={normFile}>
                      <Upload
                        accept="image/*"
                        listType="picture-card"
                        beforeUpload={() => false}
                        onChange={handleThumbnailChange}
                        showUploadList={{
                          showRemoveIcon: true,
                          showPreviewIcon: false,
                        }}
                        maxCount={1}
                      >
                        <button
                          style={{
                            color: "inherit",
                            cursor: "inherit",
                            border: 0,
                            background: "none",
                          }}
                          type="button"
                        >
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Cập nhật Thumbnail</div>
                        </button>
                      </Upload>
                    </Form.Item>
                  </div>

                  <div>
                    <Form.Item label="Tải lên hình ảnh bổ sung" valuePropName="fileList" getValueFromEvent={normFile}>
                      <Upload multiple listType="picture-card" beforeUpload={() => false} onChange={handleFileChange}>
                        <button
                          style={{
                            color: "inherit",
                            cursor: "inherit",
                            border: 0,
                            background: "none",
                          }}
                          type="button"
                        >
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Tải lên</div>
                        </button>
                      </Upload>
                    </Form.Item>
                  </div>
                </div>

                {/* Existing Media */}
                {existingMedia.length > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-medium mb-4">Hình ảnh hiện có</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {existingMedia
                          .filter((media) => !media.isThumbnail)
                          .map((media, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={media.mediaUrl || "/placeholder.svg"}
                                alt={`Media ${index}`}
                                className="w-full h-24 object-cover rounded-md"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // Copy image URL to clipboard for easy insertion
                                      navigator.clipboard.writeText(media.mediaUrl)
                                      message.success("Đã sao chép URL hình ảnh vào clipboard")
                                    }}
                                    className="bg-white text-black rounded-full p-1 text-xs"
                                  >
                                    Sao chép URL
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleConfirmDeleteMedia(media.mediaUrl)}
                                    className="bg-red-500 text-white rounded-full p-1 text-xs"
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-4">
                        Nhấp vào "Sao chép URL" và dán vào trình soạn thảo để chèn hình ảnh vào vị trí mong muốn.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {uploadedImages.length > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-medium mb-4">Hình ảnh mới đã tải lên cho nội dung</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {uploadedImages.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img.url || "/placeholder.svg"}
                              alt={`Uploaded ${index}`}
                              className="w-full h-24 object-cover rounded-md"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => {
                                  // Copy image URL to clipboard for easy insertion
                                  navigator.clipboard.writeText(img.url)
                                  message.success("Đã sao chép URL hình ảnh vào clipboard")
                                }}
                                className="bg-white text-black rounded-full p-1 text-xs"
                              >
                                Sao chép URL
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-4">
                        Nhấp vào "Sao chép URL" và dán vào trình soạn thảo để chèn hình ảnh vào vị trí mong muốn.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Tab lịch trình */}
            <TabsContent value="schedule">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Label>Loại lịch:</Label>
                  <Radio.Group
                    value={useLunarCalendar ? "lunar" : "solar"}
                    onChange={(e) => setUseLunarCalendar(e.target.value === "lunar")}
                  >
                    <Radio value="solar">Dương lịch</Radio>
                    <Radio value="lunar">Âm lịch</Radio>
                  </Radio.Group>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Form.Item
                      label={useLunarCalendar ? "Ngày bắt đầu (Dương lịch)" : "Ngày bắt đầu"}
                      name="startDate"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn ngày bắt đầu!",
                        },
                      ]}
                    >
                      <DatePicker className="w-full" format="DD/MM/YYYY" placeholder="Chọn ngày bắt đầu" />
                    </Form.Item>

                    {useLunarCalendar && (
                      <Form.Item label="Ngày bắt đầu (Âm lịch)" name="lunarStartDate">
                        <Input placeholder="Nhập ngày bắt đầu âm lịch (VD: 15/01/2023)" />
                      </Form.Item>
                    )}

                    <Form.Item
                      label="Giờ bắt đầu"
                      name="startTime"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn giờ bắt đầu!",
                        },
                      ]}
                    >
                      <TimePicker className="w-full" format="HH:mm" placeholder="Chọn giờ bắt đầu" />
                    </Form.Item>
                  </div>

                  <div>
                    <Form.Item
                      label={useLunarCalendar ? "Ngày kết thúc (Dương lịch)" : "Ngày kết thúc"}
                      name="endDate"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn ngày kết thúc!",
                        },
                      ]}
                    >
                      <DatePicker className="w-full" format="DD/MM/YYYY" placeholder="Chọn ngày kết thúc" />
                    </Form.Item>

                    {useLunarCalendar && (
                      <Form.Item label="Ngày kết thúc (Âm lịch)" name="lunarEndDate">
                        <Input placeholder="Nhập ngày kết thúc âm lịch (VD: 20/01/2023)" />
                      </Form.Item>
                    )}

                    <Form.Item
                      label="Giờ kết thúc"
                      name="endTime"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn giờ kết thúc!",
                        },
                      ]}
                    >
                      <TimePicker className="w-full" format="HH:mm" placeholder="Chọn giờ kết thúc" />
                    </Form.Item>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch checked={isRecurring} onChange={(checked) => setIsRecurring(checked)} />
                    <Label>Sự kiện lặp lại</Label>
                  </div>

                  {isRecurring && (
                    <div>
                      <Form.Item
                        label="Mẫu lặp lại"
                        name="recurrencePattern"
                        rules={[
                          {
                            required: isRecurring,
                            message: "Vui lòng nhập mẫu lặp lại!",
                          },
                        ]}
                      >
                        <Input placeholder="Nhập mẫu lặp lại" value={inputValue} onChange={handleInputChange} />
                      </Form.Item>

                      {/* Hiển thị gợi ý */}
                      {patternSuggestions.length > 0 && (
                        <div className="mb-4 bg-white border rounded-md shadow-sm">
                          <div className="p-2 text-sm text-gray-500">Gợi ý:</div>
                          <ul className="max-h-40 overflow-y-auto">
                            {patternSuggestions.map((pattern) => (
                              <li
                                key={pattern}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSuggestionSelect(pattern)}
                              >
                                {pattern} - {recurrencePatterns.find((p) => p.value === pattern)?.label}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Hiển thị gợi ý mẫu */}
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Các mẫu lặp lại phổ biến:</p>
                        <ul className="mt-1 space-y-1">
                          {recurrencePatterns.map((pattern) => (
                            <li key={pattern.value} className="flex">
                              <span
                                className="text-blue-500 cursor-pointer hover:underline"
                                onClick={() => {
                                  setInputValue(pattern.value)
                                  form.setFieldsValue({ recurrencePattern: pattern.value })
                                }}
                              >
                                {pattern.value}
                              </span>
                              <span className="ml-2">- {pattern.label}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 justify-end mt-6">
            <Button variant="outline" type="button" onClick={() => router.push("/admin/events/lists")}>
              Hủy
            </Button>
            <Button variant="default" type="submit" className="bg-blue-500 text-white" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </div>
        </Form>
      </div>

      {/* Confirm delete dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa hình ảnh</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa hình ảnh này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMedia} className="bg-red-500 text-white hover:bg-red-600">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarInset>
  )
}

export default EditEvent



