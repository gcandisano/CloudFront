export enum Categories {
  ABRIGOS = 'Abrigos',
  ACCESORIOS = 'Accesorios',
  BERMUDAS = 'Bermudas',
  CAMISAS = 'Camisas',
  OTROS = 'Otros',
  PANTALONES = 'Pantalones',
  REMERAS = 'Remeras',
  ROPA_DEPORTIVA = 'Ropa deportiva',
  ROPA_INTERIOR = 'Ropa interior',
  SHORTS = 'Shorts',
  TRAJES_DE_BANO = 'Trajes de bano',
  VESTIDOS = 'Vestidos',
  ZAPATOS = 'Zapatos',
}

export const CATEGORY_OPTIONS = Object.values(Categories).map((category) => ({
  value: category,
  label: category,
}))
