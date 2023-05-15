import create from 'zustand'

interface UserPosition{
    name: String
    position: number
}

const useStore = create((set) => ({
    user: null,
    addUser: () => set((state: any) => ({ userList: "Ivan"})),
    removeUser: () => set((state: any) => ({ userList: null })),
   }))
   
   export default useStore