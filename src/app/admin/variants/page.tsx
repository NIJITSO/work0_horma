'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Upload,
  Package,
  Layers,
  Scale
} from 'lucide-react';

interface Scent {
  id: number;
  name: string;
  nameAr?: string | null;
  slug: string;
  image?: string | null;
  isActive: boolean;
  _count?: {
    variants: number;
  };
}

interface Size {
  id: number;
  name: string;
  nameAr?: string | null;
  value: string;
  isActive: boolean;
  _count?: {
    variants: number;
  };
}

interface ProductVariantItem {
  id: number;
  productId: number;
  scentId?: number | null;
  sizeId?: number | null;
  sku: string;
  price: string | number;
  stock: number;
  image?: string | null;
  isActive: boolean;
  product: {
    id: number;
    name: string;
    slug: string;
    mainImage: string;
  };
  scent?: Scent | null;
  size?: Size | null;
}

interface ProductSimple {
  id: number;
  name: string;
}

export default function AdminVariantsPage() {
  const [activeTab, setActiveTab] = useState<'scents' | 'sizes' | 'variants'>('variants');
  const [loading, setLoading] = useState(true);

  // Data lists
  const [scents, setScents] = useState<Scent[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [variants, setVariants] = useState<ProductVariantItem[]>([]);
  const [products, setProducts] = useState<ProductSimple[]>([]);

  // Filter
  const [selectedProductId, setSelectedProductId] = useState<string>('all');

  // Modals
  const [scentModalOpen, setScentModalOpen] = useState(false);
  const [editingScent, setEditingScent] = useState<Scent | null>(null);

  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<Size | null>(null);

  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariantItem | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'scent' | 'size' | 'variant';
    id: number;
    name: string;
  } | null>(null);

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Forms
  const [scentForm, setScentForm] = useState({
    name: '',
    nameAr: '',
    slug: '',
    image: '',
    isActive: true,
  });

  const [sizeForm, setSizeForm] = useState({
    name: '',
    nameAr: '',
    value: '',
    isActive: true,
  });

  const [variantForm, setVariantForm] = useState({
    productId: '',
    scentId: '',
    sizeId: '',
    sku: '',
    price: '',
    stock: 0,
    image: '',
    isActive: true,
  });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [scentRes, sizeRes, varRes, prodRes] = await Promise.all([
        fetch('/api/admin/scents'),
        fetch('/api/admin/sizes'),
        fetch('/api/admin/variants'),
        fetch('/api/admin/products'),
      ]);

      const scentData = await scentRes.json();
      const sizeData = await sizeRes.json();
      const varData = await varRes.json();
      const prodData = await prodRes.json();

      if (scentData.scents) setScents(scentData.scents);
      if (sizeData.sizes) setSizes(sizeData.sizes);
      if (varData.variants) setVariants(varData.variants);
      if (prodData.products) {
        setProducts(
          prodData.products.map((p: { id: number; name: string }) => ({
            id: p.id,
            name: p.name,
          }))
        );
      }
    } catch (err) {
      console.error('Error loading variants data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // SCENTS HANDLERS
  const openCreateScent = () => {
    setEditingScent(null);
    setScentForm({ name: '', nameAr: '', slug: '', image: '', isActive: true });
    setErrorMessage(null);
    setScentModalOpen(true);
  };

  const openEditScent = (s: Scent) => {
    setEditingScent(s);
    setScentForm({
      name: s.name,
      nameAr: s.nameAr || '',
      slug: s.slug,
      image: s.image || '',
      isActive: s.isActive,
    });
    setErrorMessage(null);
    setScentModalOpen(true);
  };

  const handleScentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    try {
      const method = editingScent ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/scents', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingScent?.id, ...scentForm }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Erreur lors de l\'enregistrement');
        setSaving(false);
        return;
      }
      setScentModalOpen(false);
      loadAll();
    } catch {
      setErrorMessage('Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  // SIZES HANDLERS
  const openCreateSize = () => {
    setEditingSize(null);
    setSizeForm({ name: '', nameAr: '', value: '', isActive: true });
    setErrorMessage(null);
    setSizeModalOpen(true);
  };

  const openEditSize = (sz: Size) => {
    setEditingSize(sz);
    setSizeForm({
      name: sz.name,
      nameAr: sz.nameAr || '',
      value: sz.value,
      isActive: sz.isActive,
    });
    setErrorMessage(null);
    setSizeModalOpen(true);
  };

  const handleSizeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    try {
      const method = editingSize ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/sizes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingSize?.id, ...sizeForm }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Erreur lors de l\'enregistrement');
        setSaving(false);
        return;
      }
      setSizeModalOpen(false);
      loadAll();
    } catch {
      setErrorMessage('Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  // VARIANTS HANDLERS
  const openCreateVariant = () => {
    setEditingVariant(null);
    const defaultProdId = products[0]?.id ? String(products[0].id) : '';
    setVariantForm({
      productId: defaultProdId,
      scentId: '',
      sizeId: '',
      sku: `PROD-${Date.now().toString().slice(-5)}`,
      price: '150',
      stock: 50,
      image: '',
      isActive: true,
    });
    setErrorMessage(null);
    setVariantModalOpen(true);
  };

  const openEditVariant = (v: ProductVariantItem) => {
    setEditingVariant(v);
    setVariantForm({
      productId: String(v.productId),
      scentId: v.scentId ? String(v.scentId) : '',
      sizeId: v.sizeId ? String(v.sizeId) : '',
      sku: v.sku,
      price: String(v.price),
      stock: v.stock,
      image: v.image || '',
      isActive: v.isActive,
    });
    setErrorMessage(null);
    setVariantModalOpen(true);
  };

  const handleVariantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    const payload = {
      id: editingVariant?.id,
      productId: Number(variantForm.productId),
      scentId: variantForm.scentId ? Number(variantForm.scentId) : null,
      sizeId: variantForm.sizeId ? Number(variantForm.sizeId) : null,
      sku: variantForm.sku,
      price: parseFloat(variantForm.price) || 0,
      stock: Number(variantForm.stock) || 0,
      image: variantForm.image || null,
      isActive: variantForm.isActive,
    };

    try {
      const method = editingVariant ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/variants', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Erreur lors de l\'enregistrement');
        setSaving(false);
        return;
      }
      setVariantModalOpen(false);
      loadAll();
    } catch {
      setErrorMessage('Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  // Upload handler for variant or scent image
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'scent' | 'variant'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMessage(null);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: data });
      const resJson = await res.json();

      if (res.ok && resJson.success) {
        if (target === 'scent') {
          setScentForm((prev) => ({ ...prev, image: resJson.url }));
        } else {
          setVariantForm((prev) => ({ ...prev, image: resJson.url }));
        }
      } else {
        setErrorMessage(resJson.error || 'Échec de l\'upload');
      }
    } catch {
      setErrorMessage('Erreur réseau lors de l\'upload');
    } finally {
      setUploadingImage(false);
    }
  };

  // Generic Delete
  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;

    try {
      const url =
        type === 'scent'
          ? `/api/admin/scents?id=${id}`
          : type === 'size'
          ? `/api/admin/sizes?id=${id}`
          : `/api/admin/variants?id=${id}`;

      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok && data.success) {
        setDeleteConfirm(null);
        loadAll();
      } else {
        alert(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredVariants = variants.filter((v) => {
    if (selectedProductId === 'all') return true;
    return String(v.productId) === selectedProductId;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#123D35]">
            Gestion des Variétés & Déclinaisons
          </h1>
          <p className="text-xs text-[#64746E]">
            Configurez les parfums, formats/volumes et les variantes de prix & stock de chaque produit.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-white p-1 rounded-xl border border-[#2D3533]/10 shadow-xs">
          <button
            onClick={() => setActiveTab('variants')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'variants'
                ? 'bg-[#123D35] text-[#FAF7F2] shadow-xs'
                : 'text-[#64746E] hover:text-[#123D35]'
            }`}
          >
            Déclinaisons Produits ({variants.length})
          </button>
          <button
            onClick={() => setActiveTab('scents')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'scents'
                ? 'bg-[#123D35] text-[#FAF7F2] shadow-xs'
                : 'text-[#64746E] hover:text-[#123D35]'
            }`}
          >
            Parfums ({scents.length})
          </button>
          <button
            onClick={() => setActiveTab('sizes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'sizes'
                ? 'bg-[#123D35] text-[#FAF7F2] shadow-xs'
                : 'text-[#64746E] hover:text-[#123D35]'
            }`}
          >
            Formats ({sizes.length})
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: PRODUCT VARIANTS */}
      {/* ============================================================== */}
      {activeTab === 'variants' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-[#2D3533]/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-semibold text-[#123D35] shrink-0">
                Filtrer par Produit :
              </span>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full sm:w-72 px-3 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
              >
                <option value="all">Tous les produits ({variants.length} variantes)</option>
                {products.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={openCreateVariant}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#123D35] hover:bg-[#1A5449] text-[#FAF7F2] font-semibold px-4 py-2 rounded-xl shadow transition-all cursor-pointer text-xs"
            >
              <Plus className="w-4 h-4 text-[#DFB26E]" />
              <span>Ajouter une Variante</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#2D3533]/10 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-[#123D35] flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-[#123D35] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium">Chargement des variantes...</span>
              </div>
            ) : filteredVariants.length === 0 ? (
              <div className="p-12 text-center text-[#64746E] space-y-2">
                <Package className="w-10 h-10 mx-auto text-gray-300" />
                <p className="text-sm font-semibold text-[#123D35]">Aucune variante trouvée</p>
                <p className="text-xs text-gray-400">
                  Cliquez sur &quot;Ajouter une Variante&quot; pour définir un parfum, une taille ou un prix spécifique.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-[#64746E] uppercase tracking-wider font-semibold border-b border-[#2D3533]/10">
                    <tr>
                      <th className="py-3 px-4">Produit Associé</th>
                      <th className="py-3 px-4">Parfum / Senteur</th>
                      <th className="py-3 px-4">Format / Taille</th>
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Prix</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredVariants.map((v) => (
                      <tr key={v.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#123D35]">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] relative overflow-hidden shrink-0 border border-[#2D3533]/10">
                              {v.product?.mainImage ? (
                                <Image
                                  src={v.product.mainImage}
                                  alt={v.product.name}
                                  fill
                                  className="object-cover"
                                  sizes="32px"
                                />
                              ) : (
                                <Package className="w-4 h-4 text-gray-400 m-auto mt-2" />
                              )}
                            </div>
                            <span>{v.product?.name || 'Produit inconnu'}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {v.scent ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200">
                              <Sparkles className="w-3 h-3 text-[#C89748]" />
                              <span>{v.scent.name}</span>
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Par défaut (Standard)</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {v.size ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-900 border border-blue-200">
                              <Scale className="w-3 h-3 text-blue-600" />
                              <span>{v.size.value || v.size.name}</span>
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Taille unique</span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-gray-600">
                          {v.sku}
                        </td>

                        <td className="py-3 px-4 font-bold text-[#123D35]">
                          {Number(v.price).toFixed(2)} MAD
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              v.stock > 10
                                ? 'bg-emerald-100 text-emerald-800'
                                : v.stock > 0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {v.stock} en stock
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              v.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {v.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditVariant(v)}
                              className="p-1.5 text-gray-500 hover:text-[#123D35] hover:bg-gray-100 rounded-lg cursor-pointer"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'variant',
                                  id: v.id,
                                  name: `${v.product.name} (${v.sku})`,
                                })
                              }
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: SCENTS */}
      {/* ============================================================== */}
      {activeTab === 'scents' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#2D3533]/10 shadow-sm">
            <span className="text-xs text-[#64746E]">
              Gérez les arômes et parfums (ex: Fleur d&apos;Oranger, Argan &amp; Miel, Rose, Nila...)
            </span>
            <button
              onClick={openCreateScent}
              className="flex items-center gap-2 bg-[#123D35] hover:bg-[#1A5449] text-[#FAF7F2] font-semibold px-4 py-2 rounded-xl shadow transition-all cursor-pointer text-xs"
            >
              <Plus className="w-4 h-4 text-[#DFB26E]" />
              <span>Nouveau Parfum</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {scents.map((s) => (
              <div
                key={s.id}
                className="bg-white p-4 rounded-2xl border border-[#2D3533]/10 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-serif font-bold text-sm text-[#123D35]">{s.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        s.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {s.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  {s.nameAr && (
                    <p className="text-xs text-[#64746E]" dir="rtl">
                      {s.nameAr}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-400 font-mono mt-1">/{s.slug}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-[#64746E]">
                    {s._count?.variants || 0} variante(s)
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditScent(s)}
                      className="p-1 text-gray-500 hover:text-[#123D35] rounded-lg cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          type: 'scent',
                          id: s.id,
                          name: s.name,
                        })
                      }
                      className="p-1 text-rose-500 hover:text-rose-700 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: SIZES */}
      {/* ============================================================== */}
      {activeTab === 'sizes' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#2D3533]/10 shadow-sm">
            <span className="text-xs text-[#64746E]">
              Gérez les formats et contenances (ex: 50 ml, 100 ml, 250 g, 500 ml...)
            </span>
            <button
              onClick={openCreateSize}
              className="flex items-center gap-2 bg-[#123D35] hover:bg-[#1A5449] text-[#FAF7F2] font-semibold px-4 py-2 rounded-xl shadow transition-all cursor-pointer text-xs"
            >
              <Plus className="w-4 h-4 text-[#DFB26E]" />
              <span>Nouveau Format</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sizes.map((sz) => (
              <div
                key={sz.id}
                className="bg-white p-4 rounded-2xl border border-[#2D3533]/10 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-serif font-bold text-sm text-[#123D35]">{sz.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        sz.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {sz.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  {sz.nameAr && (
                    <p className="text-xs text-[#64746E]" dir="rtl">
                      {sz.nameAr}
                    </p>
                  )}
                  <p className="text-xs font-semibold text-[#C89748] mt-1">{sz.value}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-[#64746E]">
                    {sz._count?.variants || 0} variante(s)
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditSize(sz)}
                      className="p-1 text-gray-500 hover:text-[#123D35] rounded-lg cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          type: 'size',
                          id: sz.id,
                          name: sz.name,
                        })
                      }
                      className="p-1 text-rose-500 hover:text-rose-700 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-serif font-bold text-[#123D35]">
                Supprimer &quot;{deleteConfirm.name}&quot; ?
              </h3>
              <p className="text-xs text-[#64746E] mt-1">
                Cette action supprimera définitivement cet élément de la base de données.
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow cursor-pointer"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scent Add/Edit Modal */}
      {scentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-serif font-bold text-[#123D35]">
                {editingScent ? 'Modifier le Parfum' : 'Nouveau Parfum'}
              </h3>
              <button
                onClick={() => setScentModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleScentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#123D35] mb-1">
                  Nom (Français) *
                </label>
                <input
                  type="text"
                  required
                  value={scentForm.name}
                  onChange={(e) =>
                    setScentForm({
                      ...scentForm,
                      name: e.target.value,
                      slug: editingScent
                        ? scentForm.slug
                        : e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-+|-+$/g, ''),
                    })
                  }
                  placeholder="Ex: Fleur d'Oranger"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#123D35] mb-1">
                  Nom (Arabe)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={scentForm.nameAr}
                  onChange={(e) => setScentForm({ ...scentForm, nameAr: e.target.value })}
                  placeholder="مثال: زهر البرتقال"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#123D35] mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={scentForm.slug}
                  onChange={(e) => setScentForm({ ...scentForm, slug: e.target.value })}
                  placeholder="fleur-d-oranger"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35] font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="scentActive"
                  checked={scentForm.isActive}
                  onChange={(e) => setScentForm({ ...scentForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#123D35]"
                />
                <label htmlFor="scentActive" className="text-xs font-medium text-[#123D35]">
                  Parfum actif
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setScentModalOpen(false)}
                  className="px-3 py-2 text-xs text-gray-600 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#123D35] text-[#FAF7F2] text-xs font-semibold rounded-xl"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Size Add/Edit Modal */}
      {sizeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-serif font-bold text-[#123D35]">
                {editingSize ? 'Modifier le Format' : 'Nouveau Format'}
              </h3>
              <button
                onClick={() => setSizeModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSizeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#123D35] mb-1">
                  Nom du Format *
                </label>
                <input
                  type="text"
                  required
                  value={sizeForm.name}
                  onChange={(e) => setSizeForm({ ...sizeForm, name: e.target.value })}
                  placeholder="Ex: Flacon 100ml ou Pot 250g"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#123D35] mb-1">
                  Nom (Arabe)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={sizeForm.nameAr}
                  onChange={(e) => setSizeForm({ ...sizeForm, nameAr: e.target.value })}
                  placeholder="مثال: قارورة 100 مل"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#123D35] mb-1">
                  Valeur / Contenance *
                </label>
                <input
                  type="text"
                  required
                  value={sizeForm.value}
                  onChange={(e) => setSizeForm({ ...sizeForm, value: e.target.value })}
                  placeholder="100 ml ou 250 g"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="sizeActive"
                  checked={sizeForm.isActive}
                  onChange={(e) => setSizeForm({ ...sizeForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#123D35]"
                />
                <label htmlFor="sizeActive" className="text-xs font-medium text-[#123D35]">
                  Format actif
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSizeModalOpen(false)}
                  className="px-3 py-2 text-xs text-gray-600 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#123D35] text-[#FAF7F2] text-xs font-semibold rounded-xl"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Variant Add/Edit Modal */}
      {variantModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-serif font-bold text-[#123D35]">
                {editingVariant ? 'Modifier la Variante' : 'Nouvelle Déclinaison de Produit'}
              </h3>
              <button
                onClick={() => setVariantModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleVariantSubmit} className="space-y-4">
              {/* Product Select */}
              <div>
                <label className="block text-xs font-semibold text-[#123D35] mb-1">
                  Produit associé *
                </label>
                <select
                  required
                  disabled={!!editingVariant}
                  value={variantForm.productId}
                  onChange={(e) => setVariantForm({ ...variantForm, productId: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35] disabled:opacity-60"
                >
                  <option value="">Sélectionner un produit</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scent & Size Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#123D35] mb-1">
                    Parfum / Senteur
                  </label>
                  <select
                    value={variantForm.scentId}
                    onChange={(e) => setVariantForm({ ...variantForm, scentId: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                  >
                    <option value="">Sans parfum spécifique</option>
                    {scents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#123D35] mb-1">
                    Format / Contenance
                  </label>
                  <select
                    value={variantForm.sizeId}
                    onChange={(e) => setVariantForm({ ...variantForm, sizeId: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                  >
                    <option value="">Taille unique</option>
                    {sizes.map((sz) => (
                      <option key={sz.id} value={sz.id}>
                        {sz.name} ({sz.value})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SKU & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#123D35] mb-1">
                    Code SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={variantForm.sku}
                    onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })}
                    placeholder="SKU-12345"
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#123D35] mb-1">
                    Prix (MAD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={variantForm.price}
                    onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })}
                    placeholder="150"
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs font-semibold text-[#123D35] mb-1">
                  Quantité en Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={variantForm.stock}
                  onChange={(e) =>
                    setVariantForm({ ...variantForm, stock: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                />
              </div>

              {/* Variant Image */}
              <div>
                <label className="block text-xs font-semibold text-[#123D35] mb-1">
                  Image spécifique à la déclinaison (Optionnel)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={variantForm.image}
                    onChange={(e) => setVariantForm({ ...variantForm, image: e.target.value })}
                    placeholder="/images/products/... ou URL"
                    className="flex-1 px-3 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                  />
                  <label className="px-3 py-2 rounded-xl bg-[#123D35]/10 hover:bg-[#123D35]/20 text-[#123D35] text-xs font-medium cursor-pointer transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'variant')}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="variantActive"
                  checked={variantForm.isActive}
                  onChange={(e) => setVariantForm({ ...variantForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#123D35]"
                />
                <label htmlFor="variantActive" className="text-xs font-medium text-[#123D35]">
                  Déclinaison active et disponible à la commande
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setVariantModalOpen(false)}
                  className="px-3 py-2 text-xs text-gray-600 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#123D35] text-[#FAF7F2] text-xs font-semibold rounded-xl"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
