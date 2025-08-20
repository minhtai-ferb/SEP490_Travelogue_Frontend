"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDistrictManager } from "@/services/district-manager";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { StepIndicator } from "./components/StepIndicator";
import { DistrictInfoForm } from "./components/DistrictInfoForm";
import { ImageUploadForm } from "./components/ImageUploadForm";
import { CompletionStep } from "./components/CompletionStep";
import { NavigationButtons } from "./components/NavigationButtons";
import { FormDataSchema } from "./lib/schema";

type Inputs = z.infer<typeof FormDataSchema>;

const steps = [
  {
    id: "Bước 1",
    name: "Thông tin huyện",
    fields: ["name", "description", "area"],
  },
  {
    id: "Bước 2",
    name: "Tải hình ảnh",
    fields: ["image"],
  },
  { id: "Bước 3", name: "Hoàn thành" },
];

export function DistrictCreateForm({hrefCreate} : {hrefCreate: string}) {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;
  const router = useRouter();
  const { createDistrict, loading } = useDistrictManager();

  // useForm hook
  const formMethods = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
  });

  const {
    handleSubmit,
    reset,
    trigger,
  } = formMethods;

  const processForm: SubmitHandler<Inputs> = async (data) => {
    try {
      // Debugging: Log the form data
      console.log("Form data before creating FormData:", data);

      // Construct FormData object
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("area", data.area.toString()); // Convert number to string
      formData.append("description", data.description);
      formData.append("imageUpload", data.image); // Append the image file

      // Debugging: Log the FormData object
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      // Call the API
      const response = await createDistrict(formData);
      console.log("API response:", response);
      // Reset form and show success message
      reset();
      toast.success("Quận huyện đã được tạo thành công!");

      // Redirect to district list page after a delay
      setTimeout(() => {
        router.push(hrefCreate);
      }, 2000);
    } catch (error) {
      console.error("Error creating district:", error);
      toast.error("Có lỗi xảy ra khi tạo quận huyện.");
    }
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)(); // Only submit if validation passes
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0 && currentStep < steps.length - 1) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  // Tải hình ảnh
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);

        // Debugging: Log the accepted file
        console.log("Accepted file:", acceptedFiles[0]);

        // Set the image in the form state
        formMethods.setValue("image", acceptedFiles[0]);
        formMethods.clearErrors("image");
      } catch (error) {
        setPreview(null);
        formMethods.resetField("image");
      }
    },
    [formMethods]
  );

  return (
    <section className="relative flex flex-col justify-between">
      <StepIndicator steps={steps} currentStep={currentStep} />

      <FormProvider {...formMethods}>
        <form className="mt-6 py-6" onSubmit={handleSubmit(processForm)}>
          {currentStep === 0 && (
            <DistrictInfoForm delta={delta} />
          )}

          {currentStep === 1 && (
            <ImageUploadForm 
              delta={delta} 
              preview={preview} 
              onDrop={onDrop} 
            />
          )}

          {currentStep === 2 && <CompletionStep />}
        </form>
      </FormProvider>

      <NavigationButtons
        currentStep={currentStep}
        totalSteps={steps.length}
        loading={loading}
        onPrev={prev}
        onNext={next}
      />
    </section>
  );
}
