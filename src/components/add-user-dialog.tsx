"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Upload, Camera, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useState, useRef } from "react";
import { useAddUser } from "@/hooks/use-users";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a valid number greater than 0.",
  }),
});

export function AddUserDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const addUserMutation = useAddUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addUserMutation.mutateAsync({
        name: values.name,
        amount: Number(values.amount),
      });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        // Handle image file
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // Handle Excel/CSV file
        console.log("Excel/CSV file uploaded:", file);
      }
    }
  };

  const handleCameraCapture = async () => {
    try {
      // Check if the device is mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (!isMobile) {
        toast.error("Camera capture is only available on mobile devices");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setShowCamera(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please check permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && streamRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageDataUrl = canvas.toDataURL("image/jpeg");
        setImagePreview(imageDataUrl);
      }

      // Stop all video streams
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setShowCamera(false);
    }
  };

  // Cleanup function for camera stream
  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const clearImagePreview = () => {
    setImagePreview(null);
  };

  async function handleProcessImage() {
    if (!imagePreview) return;

    try {
      setProcessingStep("Converting image...");

      // Convert base64 to blob
      const base64Response = await fetch(imagePreview);
      const blob = await base64Response.blob();

      // Create FormData and append necessary data
      const formData = new FormData();
      formData.append(
        "question",
        "Extract the following information from the image in JSON format with these fields only: name (string) and amount (number). Return the data as an array of objects.",
      );
      formData.append(
        "training_data",
        'You are an AI assistant that extracts name and amount information from images. Always return data in this format: [{"name": "string", "amount": number}]',
      );
      formData.append("files", blob, "image.jpg");
      formData.append("model", "aicon-v4-large-160824");
      formData.append("stream_data", "false");
      formData.append("response_type", "json");

      setProcessingStep("Analyzing image...");
      const response = await fetch(
        "https://api-staging.worqhat.com/api/ai/content/v4",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer sk-02e44d2ccb164c738a6c4a65dbf75e89",
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const result = await response.json();
      console.log("Extracted data:", result.content);

      setProcessingStep("Processing extracted data...");
      let extractedData;
      try {
        extractedData =
          typeof result.content === "string"
            ? JSON.parse(result.content)
            : result.content;
      } catch (e) {
        console.error("Error parsing JSON:", e);
        throw new Error("Invalid response format");
      }

      if (!Array.isArray(extractedData)) {
        throw new Error("Invalid data format");
      }

      setProcessingStep("Adding users to database...");
      // Add each user to the database
      for (const userData of extractedData) {
        if (
          typeof userData.name === "string" &&
          typeof userData.amount === "number"
        ) {
          await addUserMutation.mutateAsync({
            name: userData.name,
            amount: userData.amount,
          });
        }
      }

      toast.success(`Successfully added ${extractedData.length} users`);
      setIsOpen(false);
      setImagePreview(null);
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to process image",
      );
    } finally {
      setProcessingStep("");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add User Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User Details</DialogTitle>
          <DialogDescription>
            Add user details manually or upload multiple users at once.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Add User
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="upload" className="space-y-4">
            <div className="grid gap-4">
              {showCamera ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg"
                  />
                  <Button className="w-full mt-4" onClick={capturePhoto}>
                    Take Photo
                  </Button>
                </div>
              ) : imagePreview ? (
                <div className="relative">
                  <div className="absolute -top-2 -right-2 z-10">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={clearImagePreview}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <Button className="w-full mt-4" onClick={handleProcessImage}>
                    {processingStep || "Process Image"}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 space-y-2">
                    <Input
                      type="file"
                      accept=".csv,.xlsx,.xls,image/*"
                      className="hidden"
                      id="file-upload"
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center cursor-pointer space-y-2"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Upload Excel, CSV, or Image file
                      </span>
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleCameraCapture}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Take a Picture
                  </Button>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
