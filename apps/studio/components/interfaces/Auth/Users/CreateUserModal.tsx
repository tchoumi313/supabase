import { PermissionAction } from '@supabase/shared-types/out/constants'
import { useParams } from 'common'
import toast from 'react-hot-toast'

import { useUserCreateMutation } from 'data/auth/user-create-mutation'
import { useProjectApiQuery } from 'data/config/project-api-query'
import { useCheckPermissions } from 'hooks/misc/useCheckPermissions'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import {
  IconLock,
  IconMail,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogSectionSeparator,
  DialogTitle,
  FormControl_Shadcn_,
  FormField_Shadcn_,
  FormItem_Shadcn_,
  FormLabel_Shadcn_,
  FormMessage_Shadcn_,
  Form_Shadcn_,
  Input_Shadcn_,
  Checkbox_Shadcn_,
} from 'ui'

export type CreateUserModalProps = {
  visible: boolean
  setVisible: (visible: boolean) => void
}

const CreateUserModal = ({ visible, setVisible }: CreateUserModalProps) => {
  const { ref: projectRef } = useParams()

  const { data, isLoading, isSuccess } = useProjectApiQuery({ projectRef }, { enabled: visible })

  const canCreateUsers = useCheckPermissions(PermissionAction.AUTH_EXECUTE, 'create_user')

  const { mutate: createUser, isLoading: isCreatingUser } = useUserCreateMutation({
    async onSuccess(res) {
      toast.success(`Successfully created user: ${res.email}`)
      setVisible(false)
    },
  })

  const onCreateUser = async (values: any) => {
    if (!isSuccess) {
      return toast.error(`Failed to create user: Error loading project config`)
    }
    const { protocol, endpoint, serviceApiKey } = data.autoApiService
    createUser({ projectRef, endpoint, protocol, serviceApiKey, user: values })

    //react-hook-form does not reset field values even after submit. Reset Field data so data does not persist
    form.reset({ email: '', password: '', autoConfirmUser: true })
  }

  const FormSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Must be a valid email address'),
    password: z.string().min(1, 'Password is required'),
    autoConfirmUser: z.boolean(),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(FormSchema),
    defaultValues: { email: '', password: '', autoConfirmUser: true },
  })

  return (
    <Dialog open={visible} onOpenChange={setVisible}>
      <DialogContent size="small">
        <DialogHeader>
          <DialogTitle>Create a new user</DialogTitle>
        </DialogHeader>
        <DialogSectionSeparator />
        <Form_Shadcn_ {...form}>
          <form
            id="create-user"
            className="flex flex-col gap-y-4 p-6"
            onSubmit={form.handleSubmit(onCreateUser)}
          >
            <FormField_Shadcn_
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem_Shadcn_ className="flex flex-col gap-y-2">
                  <FormLabel_Shadcn_>Email address</FormLabel_Shadcn_>
                  <FormControl_Shadcn_>
                    <div className="items-center">
                      <IconMail className="relative left-2 top-9 transform -translate-y-1/2" />
                      <Input_Shadcn_
                        autoFocus
                        {...field}
                        autoComplete="off"
                        type="email"
                        name="email"
                        placeholder="user@example.com"
                        disabled={isCreatingUser || isLoading}
                        className="pl-8"
                      />
                    </div>
                  </FormControl_Shadcn_>
                  <FormMessage_Shadcn_ />
                </FormItem_Shadcn_>
              )}
            />

            <FormField_Shadcn_
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem_Shadcn_ className="flex flex-col gap-y-2">
                  <FormLabel_Shadcn_>User Password</FormLabel_Shadcn_>
                  <FormControl_Shadcn_>
                    <div className="items-center">
                      <IconLock className="relative left-2 top-9 transform -translate-y-1/2" />
                      <Input_Shadcn_
                        autoFocus
                        {...field}
                        autoComplete="new-password"
                        type="password"
                        name="password"
                        placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                        disabled={isCreatingUser || isLoading}
                        className="pl-8"
                      ></Input_Shadcn_>
                    </div>
                  </FormControl_Shadcn_>
                  <FormMessage_Shadcn_ />
                </FormItem_Shadcn_>
              )}
            />

            <FormField_Shadcn_
              name="autoConfirmUser"
              control={form.control}
              render={({ field }) => (
                <FormItem_Shadcn_ className="flex items-center gap-x-2">
                  <FormControl_Shadcn_>
                    <Checkbox_Shadcn_
                      checked={field.value}
                      onCheckedChange={(value) => field.onChange(value)}
                    />
                  </FormControl_Shadcn_>
                  <FormLabel_Shadcn_>Auto Confirm User?</FormLabel_Shadcn_>
                </FormItem_Shadcn_>
              )}
            />

            <FormLabel_Shadcn_>
              <p className="text-sm text-foreground-lighter">
                A confirmation email will not be sent when creating a user via this form.
              </p>
            </FormLabel_Shadcn_>

            <Button
              block
              size="small"
              htmlType="submit"
              loading={isCreatingUser}
              disabled={!canCreateUsers || isCreatingUser || isLoading}
            >
              Create user
            </Button>
          </form>
        </Form_Shadcn_>
      </DialogContent>
    </Dialog>
  )
}

export default CreateUserModal
