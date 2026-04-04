import type { Meta, StoryObj } from "@storybook/react"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form"
import { Input } from "./input"
import { Button } from "./button"
import { Checkbox } from "./checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { Textarea } from "./textarea"

const meta = {
  title: "Components/Form/Form",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj

export const BasicForm: Story = {
  name: "Basic Form",
  render: () => {
    const form = useForm({ defaultValues: { username: "", email: "" } })
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})} className="space-y-6 w-[400px]">
          <FormField
            control={form.control}
            name="username"
            rules={{ required: "Username is required", minLength: { value: 3, message: "At least 3 characters" } }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>This is your public display name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="hello@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    )
  },
}

export const WithValidation: Story = {
  name: "With Validation",
  render: () => {
    const form = useForm({ defaultValues: { username: "" }, mode: "onBlur" })
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})} className="space-y-6 w-[400px]">
          <FormField
            control={form.control}
            name="username"
            rules={{ required: "Username is required", minLength: { value: 3, message: "Minimum 3 characters" } }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" {...field} />
                </FormControl>
                <FormDescription>Must be at least 3 characters.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create account</Button>
        </form>
      </Form>
    )
  },
}

export const ComplexForm: Story = {
  name: "Complex Form",
  render: () => {
    const form = useForm({
      defaultValues: { name: "", role: "", bio: "", terms: false },
    })
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})} className="space-y-6 w-[400px]">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us about yourself..." {...field} />
                </FormControl>
                <FormDescription>Max 160 characters.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Accept terms and conditions</FormLabel>
                  <FormDescription>You agree to our Terms of Service.</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Form>
    )
  },
}
