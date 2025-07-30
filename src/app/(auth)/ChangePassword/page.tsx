"use client";
import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

export default function ForgotPassword() {
  const [errorMessage, setError] = useState<string | null>(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const router = useRouter();

  const forgotFormik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Enter a valid email").required("Email required"),
    }),
    onSubmit: (values) => {
      axios
        .post("https://linked-posts.routemisr.com/users/forgot-password", values)
        .then((res) => {
          if (res.data.message === "success") {
            localStorage.setItem("resetEmail", values.email);
            setShowResetForm(true);
          }
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Something went wrong");
        });
    },
  });

  const resetCodeFormik = useFormik({
    initialValues: { resetCode: "" },
    validationSchema: Yup.object({
      resetCode: Yup.string().required("Reset code required"),
    }),
    onSubmit: (values) => {
      axios
        .post("https://linked-posts.routemisr.com/users/verify-reset-code", values)
        .then((res) => {
          if (res.data.message === "success") {
            localStorage.setItem("resetCode", values.resetCode);
            router.push("/UpdatePassword");
          }
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Something went wrong");
        });
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">
        {showResetForm ? "Enter Reset Code" : "Forgot Password"}
      </h2>

      {!showResetForm ? (
        <form onSubmit={forgotFormik.handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={forgotFormik.values.email}
            onChange={forgotFormik.handleChange}
            onBlur={forgotFormik.handleBlur}
            className="w-full p-2 border rounded mb-2"
          />
          {forgotFormik.touched.email && forgotFormik.errors.email && (
            <p className="text-red-500 text-sm">{forgotFormik.errors.email}</p>
          )}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Send Code
          </button>
        </form>
      ) : (
        <form onSubmit={resetCodeFormik.handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
          <input
            type="text"
            name="resetCode"
            placeholder="Enter reset code"
            value={resetCodeFormik.values.resetCode}
            onChange={resetCodeFormik.handleChange}
            onBlur={resetCodeFormik.handleBlur}
            className="w-full p-2 border rounded mb-2"
          />
          {resetCodeFormik.touched.resetCode && resetCodeFormik.errors.resetCode && (
            <p className="text-red-500 text-sm">{resetCodeFormik.errors.resetCode}</p>
          )}
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            Verify Code
          </button>
        </form>
      )}

      {errorMessage && (
        <p className="mt-4 text-red-600 text-center">{errorMessage}</p>
      )}
    </div>
  );
}