import { supabase } from './supabaseClient'
import type {
  ProductImage,
  SponsorshipOffer,
  SponsorshipOfferPayload,
  SponsorshipProduct,
  SponsorshipStatus,
  SponsorshipTypeId,
  OrganizerAllocation,
  OrganizerDiscountDetails,
  OrganizerFinancialDetails,
  OrganizerProductDetails,
  OrganizerOtherDetails,
  OrganizerRequestPayload,
  OrganizerSponsorshipRequest,
  OrganizerRequestTypeId,
  OfferProductDetails,
  OfferDiscountDetails,
  OfferFinancialDetails,
  OfferOtherDetails,
  OfferCustomMix
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
  other_details: Record<string, unknown> | null
  custom_mix: Record<string, unknown> | null
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

interface OrganizerSponsorshipRequestRow {
  id: string
  organizer_id: string
  selected_types: string[] | null
  product_details: Record<string, unknown> | null
  discount_details: Record<string, unknown> | null
  financial_details: Record<string, unknown> | null
  allocation: Record<string, unknown> | null
  other_details: Record<string, unknown> | null
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

const SPONSORSHIP_TYPE_VALUES: SponsorshipTypeId[] = [
  'product',
  'discount',
  'financial',
  'other'
]

const defaultProductDetails: OfferProductDetails = {
  name: '',
  description: '',
  quantity: ''
}

const defaultDiscountDetails: OfferDiscountDetails = {
  code: '',
  value: '',
  validFrom: '',
  validTo: ''
}

const defaultFinancialDetails: OfferFinancialDetails = {
  amount: '',
  terms: 'upfront'
}

const defaultOtherDetails: OfferOtherDetails = {
  title: '',
  description: ''
}

const defaultCustomMix: OfferCustomMix = {
  product: 33,
  discount: 33,
  financial: 34
}

const ORGANIZER_REQUEST_TYPE_VALUES: OrganizerRequestTypeId[] = [
  'product',
  'discount',
  'financial',
  'media',
  'other'
]

const defaultOrganizerProductDetails: OrganizerProductDetails = {
  items: '',
  quantity: ''
}

const defaultOrganizerDiscountDetails: OrganizerDiscountDetails = {
  targetLevel: '',
  expectedVolume: ''
}

const defaultOrganizerFinancialDetails: OrganizerFinancialDetails = {
  minAmount: '',
  maxAmount: '',
  paymentWindow: 'before'
}

const defaultOrganizerAllocation: OrganizerAllocation = {
  product: 33,
  discount: 33,
  financial: 34
}

const defaultOrganizerOtherDetails: OrganizerOtherDetails = {
  title: '',
  description: ''
}

const normalizeSelectedTypes = (
  types: string[] | null
): SponsorshipTypeId[] => {
  if (!Array.isArray(types)) return []
  return types.filter((type): type is SponsorshipTypeId =>
    SPONSORSHIP_TYPE_VALUES.includes(type as SponsorshipTypeId)
  )
}

const normalizeProductDetails = (
  details: Record<string, unknown> | null
): OfferProductDetails => {
  if (!details) return { ...defaultProductDetails }
  return {
    name: typeof details.name === 'string' ? details.name : defaultProductDetails.name,
    description:
      typeof details.description === 'string'
        ? details.description
        : defaultProductDetails.description,
    quantity:
      typeof details.quantity === 'string'
        ? details.quantity
        : defaultProductDetails.quantity
  }
}

const normalizeDiscountDetails = (
  details: Record<string, unknown> | null
): OfferDiscountDetails => {
  if (!details) return { ...defaultDiscountDetails }
  return {
    code: typeof details.code === 'string' ? details.code : defaultDiscountDetails.code,
    value: typeof details.value === 'string' ? details.value : defaultDiscountDetails.value,
    validFrom:
      typeof details.validFrom === 'string'
        ? details.validFrom
        : defaultDiscountDetails.validFrom,
    validTo:
      typeof details.validTo === 'string'
        ? details.validTo
        : defaultDiscountDetails.validTo
  }
}

const normalizeFinancialDetails = (
  details: Record<string, unknown> | null
): OfferFinancialDetails => {
  if (!details) return { ...defaultFinancialDetails }
  return {
    amount: typeof details.amount === 'string' ? details.amount : defaultFinancialDetails.amount,
    terms: typeof details.terms === 'string' ? details.terms : defaultFinancialDetails.terms
  }
}

const normalizeOtherDetails = (
  details: Record<string, unknown> | null
): OfferOtherDetails => {
  if (!details) return { ...defaultOtherDetails }
  return {
    title:
      typeof details.title === 'string'
        ? details.title
        : defaultOtherDetails.title,
    description:
      typeof details.description === 'string'
        ? details.description
        : defaultOtherDetails.description
  }
}

const normalizeCustomMix = (
  mix: Record<string, unknown> | null
): OfferCustomMix => {
  if (!mix) return { ...defaultCustomMix }
  const product = mix.product
  const discount = mix.discount
  const financial = mix.financial
  return {
    product: typeof product === 'number' ? product : defaultCustomMix.product,
    discount: typeof discount === 'number' ? discount : defaultCustomMix.discount,
    financial: typeof financial === 'number' ? financial : defaultCustomMix.financial
  }
}

const normalizeOrganizerTypes = (
  types: string[] | null
): OrganizerRequestTypeId[] => {
  if (!Array.isArray(types)) return []
  return types.filter((type): type is OrganizerRequestTypeId =>
    ORGANIZER_REQUEST_TYPE_VALUES.includes(type as OrganizerRequestTypeId)
  )
}

const normalizeOrganizerProductDetails = (
  details: Record<string, unknown> | null
): OrganizerProductDetails => {
  if (!details) return { ...defaultOrganizerProductDetails }
  return {
    items:
      typeof details.items === 'string'
        ? details.items
        : defaultOrganizerProductDetails.items,
    quantity:
      typeof details.quantity === 'string'
        ? details.quantity
        : defaultOrganizerProductDetails.quantity
  }
}

const normalizeOrganizerDiscountDetails = (
  details: Record<string, unknown> | null
): OrganizerDiscountDetails => {
  if (!details) return { ...defaultOrganizerDiscountDetails }
  return {
    targetLevel:
      typeof details.targetLevel === 'string'
        ? details.targetLevel
        : defaultOrganizerDiscountDetails.targetLevel,
    expectedVolume:
      typeof details.expectedVolume === 'string'
        ? details.expectedVolume
        : defaultOrganizerDiscountDetails.expectedVolume
  }
}

const normalizeOrganizerFinancialDetails = (
  details: Record<string, unknown> | null
): OrganizerFinancialDetails => {
  if (!details) return { ...defaultOrganizerFinancialDetails }
  return {
    minAmount:
      typeof details.minAmount === 'string'
        ? details.minAmount
        : defaultOrganizerFinancialDetails.minAmount,
    maxAmount:
      typeof details.maxAmount === 'string'
        ? details.maxAmount
        : defaultOrganizerFinancialDetails.maxAmount,
    paymentWindow:
      typeof details.paymentWindow === 'string'
        ? details.paymentWindow
        : defaultOrganizerFinancialDetails.paymentWindow
  }
}

const normalizeOrganizerAllocation = (
  allocation: Record<string, unknown> | null
): OrganizerAllocation => {
  if (!allocation) return { ...defaultOrganizerAllocation }
  const product = allocation.product
  const discount = allocation.discount
  const financial = allocation.financial
  return {
    product:
      typeof product === 'number' ? product : defaultOrganizerAllocation.product,
    discount:
      typeof discount === 'number' ? discount : defaultOrganizerAllocation.discount,
    financial:
      typeof financial === 'number'
        ? financial
        : defaultOrganizerAllocation.financial
  }
}

const normalizeOrganizerOtherDetails = (
  details: Record<string, unknown> | null
): OrganizerOtherDetails => {
  if (!details) return { ...defaultOrganizerOtherDetails }
  return {
    title:
      typeof details.title === 'string'
        ? details.title.slice(0, 100)
        : defaultOrganizerOtherDetails.title,
    description:
      typeof details.description === 'string'
        ? details.description.slice(0, 500)
        : defaultOrganizerOtherDetails.description
  }
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
  selectedTypes: normalizeSelectedTypes(row.selected_types),
  productDetails: normalizeProductDetails(row.product_details),
  discountDetails: normalizeDiscountDetails(row.discount_details),
  financialDetails: normalizeFinancialDetails(row.financial_details),
  otherDetails: normalizeOtherDetails(row.other_details),
  customMix: normalizeCustomMix(row.custom_mix),
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at
})

const mapOrganizerRequestRow = (
  row: OrganizerSponsorshipRequestRow
): OrganizerSponsorshipRequest => ({
  id: row.id,
  organizerId: row.organizer_id,
  selectedTypes: normalizeOrganizerTypes(row.selected_types),
  productDetails: normalizeOrganizerProductDetails(row.product_details),
  discountDetails: normalizeOrganizerDiscountDetails(row.discount_details),
  financialDetails: normalizeOrganizerFinancialDetails(row.financial_details),
  allocation: normalizeOrganizerAllocation(row.allocation),
  otherDetails: normalizeOrganizerOtherDetails(row.other_details),
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

  if (error) {
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
    other_details: payload.otherDetails,
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

export async function fetchOrganizerSponsorshipRequest(
  organizerId: string
): Promise<OrganizerSponsorshipRequest | null> {
  const { data, error } = await supabase
    .from('organizer_sponsorship_requests')
    .select('*')
    .eq('organizer_id', organizerId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load organizer sponsorship request: ${error.message}`)
  }

  return data ? mapOrganizerRequestRow(data as OrganizerSponsorshipRequestRow) : null
}

export async function saveOrganizerSponsorshipRequest(
  organizerId: string,
  payload: OrganizerRequestPayload,
  status: 'draft' | 'published'
): Promise<OrganizerSponsorshipRequest> {
  const row = {
    organizer_id: organizerId,
    selected_types: payload.selectedTypes,
    product_details: payload.productDetails,
    discount_details: payload.discountDetails,
    financial_details: payload.financialDetails,
    allocation: payload.allocation,
    other_details: payload.otherDetails,
    status
  }

  const { data, error } = await supabase
    .from('organizer_sponsorship_requests')
    .upsert(row, { onConflict: 'organizer_id' })
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to save organizer sponsorship request: ${error.message}`)
  }

  return mapOrganizerRequestRow(data as OrganizerSponsorshipRequestRow)
}
