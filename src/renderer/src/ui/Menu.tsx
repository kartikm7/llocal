import { cn } from '@renderer/utils/utils'
import * as MenuProvider from '@radix-ui/react-dropdown-menu'
import { VariantProps, cva } from 'class-variance-authority'

const Menu = MenuProvider.Root
const MenuTrigger = MenuProvider.Trigger

const MenuContent = ({ className, children, align = "center", ...props }: MenuProvider.DropdownMenuContentProps): React.ReactElement => {
  return <MenuProvider.Portal>
    <MenuProvider.Content className={cn('w-44 data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut m-2 bg-foreground bg-opacity-30 dark:bg-background dark:bg-opacity-30 dark:text-foreground text-sm p-2 rounded-2xl backdrop-blur-xl transition-all', className)} align={align} {...props}>
      {children}
    </MenuProvider.Content>
  </MenuProvider.Portal>
}


const MenuItemVariants = cva('font-poppins w-full ', {
  variants: {
    variant: {
      base: '',
      interactable: 'w-full data-[highlighted]:underline data-[highlighted]:scale-[0.98] data-[highlighted]:opacity-100 outline-none hover:underline hover:scale-[0.98] opacity-60 hover:opacity-100 transition-all',
    }
  },
  defaultVariants: {
    variant: 'interactable'
  }
})


interface MenuItemProps extends MenuProvider.DropdownMenuItemProps, VariantProps<typeof MenuItemVariants> { }

const MenuItem = ({ className, variant, children, ...props }: MenuItemProps): React.ReactElement => {
  return <MenuProvider.DropdownMenuItem className={cn(MenuItemVariants({ variant, className }))} {...props}>
    {children}
  </MenuProvider.DropdownMenuItem>
}


export { Menu, MenuTrigger, MenuContent, MenuItem }
