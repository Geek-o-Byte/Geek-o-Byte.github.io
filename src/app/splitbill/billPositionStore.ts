import create from 'zustand'

interface UserPosition{
    name: String
    position: number
}

const useStore: any = create((set: any) => ({
    user: null,
    addUser: () => set((state: any) => ({ userList: "Ivan"})),
    removeUser: () => set((state: any) => ({ userList: null })),
   }))
   
   export default useStore