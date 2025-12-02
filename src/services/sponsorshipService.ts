import { supabase } from './supabaseClient'
import type {
  ProductImage,
  SponsorshipOffer,
  SponsorshipOfferPayload,
  SponsorshipProduct,
  SponsorshipStatus
} from '../types/sponsorship'

interface SponsorshipProductRow {
  id: string
  brand_id: string
  name: string
  goals: string
  quantity: number
  unit: string
  details: string | null
  status: SponsorshipStatus
  images: ProductImage[] | null
  order_index: number | null
  created_at: string
  updated_at: string
}

interface SponsorshipOfferRow {
  id: string
  brand_id: string
  selected_types: string[] | null
  product_details: Record<string, unknown> | null
  discount_details: Record<string, unknown> | null
  financial_details: Record<string, unknown> | null
  custom_mix: Record<string, unknown> | null
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

const stripImageFiles = (images: ProductImage[]) =>
  images.map((image) => ({ id: image.id, url: image.url }))

const mapProductRow = (row: SponsorshipProductRow): SponsorshipProduct => ({
  id: row.id,
  name: row.name,
  goals: row.goals,
  quantity: row.quantity,
  unit: row.unit,
  details: row.details ?? undefined,
  status: row.status,
  images: (row.images ?? []) as ProductImage[],
  order: row.order_index ?? 0
})

const mapOfferRow = (row: SponsorshipOfferRow): SponsorshipOffer => ({
  id: row.id,
  brandId: row.brand_id,
  selectedTypes: (row.selected_types ?? []) as string[],
  productDetails:
    (row.product_details as SponsorshipOffer['productDetails']) ?? {
      name: '',
      description: '',
      quantity: ''
    },
  discountDetails:
    (row.discount_details as SponsorshipOffer['discountDetails']) ?? {
      code: '',
      value: '',
      validFrom: '',
      validTo: ''
    },
  financialDetails:
    (row.financial_details as SponsorshipOffer['financialDetails']) ?? {
      amount: '',
      terms: 'upfront'
    },
  customMix: (row.custom_mix as SponsorshipOffer['customMix']) ?? {
    product: 33,
    discount: 33,
    financial: 34
  },
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at
})

export async function fetchSponsorshipProducts(
  brandId: string
): Promise<SponsorshipProduct[]> {
  const { data, error } = await supabase
    .from('sponsorship_products')
    .select('*')
    .eq('brand_id', brandId)
    .order('order_index', { ascending: true })

  if (error) {
    throw new Error(`Failed to load sponsorship products: ${error.message}`)
  }

  return (data as SponsorshipProductRow[]).map(mapProductRow)
}

export async function createSponsorshipProduct(
  brandId: string,
  product: Omit<SponsorshipProduct, 'id'>
): Promise<SponsorshipProduct> {
  const payload = {
    brand_id: brandId,
    name: product.name,
    goals: product.goals,
    quantity: product.quantity,
    unit: product.unit,
    details: product.details ?? null,
    status: product.status,
    images: stripImageFiles(product.images),
    order_index: product.order
  }

  const { data, error } = await supabase
    .from('sponsorship_products')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to create sponsorship product: ${error.message}`)
  }

  return mapProductRow(data as SponsorshipProductRow)
}

export async function updateSponsorshipProduct(
  productId: string,
  product: Omit<SponsorshipProduct, 'id'>
): Promise<SponsorshipProduct> {
  const payload = {
    name: product.name,
    goals: product.goals,
    quantity: product.quantity,
    unit: product.unit,
    details: product.details ?? null,
    status: product.status,
    images: stripImageFiles(product.images),
    order_index: product.order
  }

  const { data, error } = await supabase
    .from('sponsorship_products')
    .update(payload)
    .eq('id', productId)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to update sponsorship product: ${error.message}`)
  }

  return mapProductRow(data as SponsorshipProductRow)
}

export async function deleteSponsorshipProduct(
  productId: string
): Promise<void> {
  const { error } = await supabase
    .from('sponsorship_products')
    .delete()
    .eq('id', productId)

  if (error) {
    throw new Error(`Failed to delete sponsorship product: ${error.message}`)
  }
}

export async function updateProductOrders(
  updates: { id: string; order: number }[]
): Promise<void> {
  if (!updates.length) return

  const { error } = await supabase
    .from('sponsorship_products')
    .upsert(updates.map((item) => ({ id: item.id, order_index: item.order })))

  if (error) {
    throw new Error(`Failed to reorder sponsorship products: ${error.message}`)
  }
}

export async function fetchSponsorshipOffer(
  brandId: string
): Promise<SponsorshipOffer | null> {
  const { data, error } = await supabase
    .from('sponsorship_offers')
    .select('*')
    .eq('brand_id', brandId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to load sponsorship offer: ${error.message}`)
  }

  return data ? mapOfferRow(data as SponsorshipOfferRow) : null
}

export async function saveSponsorshipOffer(
  brandId: string,
  payload: SponsorshipOfferPayload,
  status: 'draft' | 'published'
): Promise<SponsorshipOffer> {
  const row = {
    brand_id: brandId,
    selected_types: payload.selectedTypes,
    product_details: payload.productDetails,
    discount_details: payload.discountDetails,
    financial_details: payload.financialDetails,
    custom_mix: payload.customMix,
    status
  }

  const { data, error } = await supabase
    .from('sponsorship_offers')
    .upsert(row, { onConflict: 'brand_id' })
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to save sponsorship offer: ${error.message}`)
  }

  return mapOfferRow(data as SponsorshipOfferRow)
}
