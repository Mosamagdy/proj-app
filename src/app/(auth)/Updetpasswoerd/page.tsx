"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

export default function UpdatePassword() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    const storedCode = localStorage.getItem("resetCode");
    if (storedEmail && storedCode) {
      setEmail(storedEmail);
      setResetCode(storedCode);
    } else {
      router.push("/ForgotPassword");
    }
  }, [router]);

  const formik = useFormik({
    initialValues: { newPassword: "" },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("New password is required"),
    }),
    onSubmit: (values) => {
      axios
        .put("https://linked-posts.routemisr.com/users/change-password", {
          email,
          newPassword: values.newPassword,
          resetCode,
        })
        .then(() => {
          toast.success("Password updated successfully");
          localStorage.removeItem("resetEmail");
          localStorage.removeItem("resetCode");
          router.push("/Login");
        })
        .catch((err) => {
          setErrorMessage(err.response?.data?.message || "Something went wrong");
        });
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">Update Your Password 🔐</h2>
      <form onSubmit={formik.handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <label htmlFor="newPassword" className="block text-gray-700 font-bold mb-2">
          New Password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.newPassword}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter new password"
        />
        {formik.touched.newPassword && formik.errors.newPassword && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.newPassword}</p>
        )}
        <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
          Update Password
        </button>
        {errorMessage && (
          <p className="text-red-600 text-sm mt-4 text-center">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}