import { ipcMain } from 'electron'
import { ProductRepo } from '../repositories/product.repo'

export function registerProductIPC() {
    ipcMain.handle('products:get', () => ProductRepo.getAll())
    ipcMain.handle('products:create', (_, p) => ProductRepo.create(p))
    ipcMain.handle('products:update', (_, p) => ProductRepo.update(p))
    ipcMain.handle('products:delete', (_, id) => ProductRepo.delete(id))
}
