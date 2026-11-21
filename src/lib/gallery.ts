import { supabase } from './supabase'
import type { GalleryPhoto } from './types'

export async function fetchGalleryPhotos(): Promise<GalleryPhoto[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as GalleryPhoto[]
}

export async function fetchTripGallery(tripId: string): Promise<GalleryPhoto[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .eq('trip_id', tripId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as GalleryPhoto[]
}

export async function addGalleryPhoto(input: {
  trip_id: string | null
  image_url: string
  caption: string | null
}): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.from('gallery_photos').insert(input)
  if (error) throw error
}

export async function deleteGalleryPhoto(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.from('gallery_photos').delete().eq('id', id)
  if (error) throw error
}

/**
 * Compress a photo in the browser before upload: max 1920px on the long
 * edge, JPEG ~82%. Keeps drone shots light so storage lasts for years.
 * Non-raster files (e.g. gif/svg) pass through untouched.
 */
export async function compressImage(file: File): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file
  const bitmap = await createImageBitmap(file).catch(() => null)
  if (!bitmap) return file
  const max = 1920
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return file
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.82),
  )
  // Only use the compressed version when it actually saves space
  return blob && blob.size < file.size ? blob : file
}

export async function uploadGalleryImage(file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured')
  const blob = await compressImage(file)
  const ext = blob.type === 'image/jpeg' ? 'jpg' : (file.name.split('.').pop() ?? 'jpg')
  const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from('trip-images').upload(path, blob, {
    cacheControl: '31536000',
    upsert: false,
    contentType: blob.type || file.type,
  })
  if (error) throw error
  const { data } = supabase.storage.from('trip-images').getPublicUrl(path)
  return data.publicUrl
}
