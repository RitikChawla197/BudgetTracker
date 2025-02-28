'use client';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useState } from "react";
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from "@tanstack/react-query";
import { register } from "@/lib/helpers";
import { save } from "@/store/slices/auth.slice";
import { useAppDispatch } from "@/store/reduxHooks";
import { changeProfileWhenRegister } from "@/store/slices/profile.slice";

export interface SignUpFormData {
  username: string;
  email: string;
  password: string;
}

const formSchema = z.object({
  username: z.string().trim().min(2, {
    message: 'Username must be at least 2 characters long'
  }).max(30, {
    message: 'Username cannot be longer than 30 characters'
  }),
  email: z.string().trim().email('Email must be valid'),
  password: z.string().trim().min(5, 'Password must be at least 5 characters long').max(20, {
    message: 'Password cannot be longer than 20 characters'
  })
})

export default function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    username: ''
  });

  const { mutate, isPending, isError, isSuccess, data, error } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      dispatch(save(data.data.token));
      dispatch(changeProfileWhenRegister({
        email: data.data.email,
        username: data.data.username
      }));
    },
    onError: (error) => {
      console.log({
        error
      })
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      email: formData.email,
      password: formData.password,
      username: formData.username
    }
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  }
  console.log({
    isSuccess,
    isError,
    data,
    error
  })

  return (
    <Form {...form}>
      <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Sign up</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to sign up your account
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            Sign Up
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <Button variant="outline" className="w-full">
            <FcGoogle />
            Sign up with Google
          </Button>
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </form>
    </Form>
  )
}
