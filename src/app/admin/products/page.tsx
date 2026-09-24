'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  Upload,
  AlertTriangle,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

interface ProductImageItem {
  id: number;
  image: string;
  isMain: boolean;
}

interface ProductVariantItem {
  id: number;
  sku: string;
  price: string | number;
  stock: number;
  scent?: { name: string } | null;
  size?: { name: string; value: string } | null;
}

interface Product {
  id: number;
  categoryId: number;
  category: Category;
  name: string;
  slug: string;
  description?: string | null;
  mainImage: string;
  basePrice: string | number;
  isActive: boolean;
  nameAr?: string | null;
  nameFr?: string | null;
  subtitleAr?: string | null;
  subtitleFr?: string | null;
  descriptionAr?: string | null;
  descriptionFr?: string | null;
  ingredientsAr?: string | null;
  ingredientsFr?: string | null;
  usageAr?: string | null;
  usageFr?: string | null;
  images: ProductImageItem[];
  variants: ProductVariantItem[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    nameFr: '',
    nameAr: '',
    slug: '',
    categoryId: '',
    basePrice: '',
    mainImage: '',
    subtitleFr: '',
    subtitleAr: '',
    descriptionFr: '',
    descriptionAr: '',
    ingredientsFr: '',
    ingredientsAr: '',
    usageFr: '',
    usageAr: '',
    isActive: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/categories'),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();

      if (prodData.products) setProducts(prodData.products);
      if (catData.categories) setCategories(catData.categories);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      nameFr: '',
      nameAr: '',
      slug: '',
      categoryId: categories[0]?.id ? String(categories[0].id) : '',
      basePrice: '150',
      mainImage: '',
      subtitleFr: '',
      subtitleAr: '',
      descriptionFr: '',
      descriptionAr: '',
      ingredientsFr: '',
      ingredientsAr: '',
      usageFr: '',
      usageAr: '',
      isActive: true,
    });
    setErrorMessage(null);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name || '',
      nameFr: p.nameFr || p.name || '',
      nameAr: p.nameAr || '',
      slug: p.slug || '',
      categoryId: String(p.categoryId),
      basePrice: String(p.basePrice),
      mainImage: p.mainImage || '',
      subtitleFr: p.subtitleFr || '',
      subtitleAr: p.subtitleAr || '',
      descriptionFr: p.descriptionFr || p.description || '',
      descriptionAr: p.descriptionAr || '',
      ingredientsFr: p.ingredientsFr || '',
      ingredientsAr: p.ingredientsAr || '',
      usageFr: p.usageFr || '',
      usageAr: p.usageAr || '',
      isActive: p.isActive,
    });
    setErrorMessage(null);
    setModalOpen(true);
  };

  // Auto generate slug if creating
  const handleNameChange = (val: string) => {
    setForm((prev) => {
      const updated = { ...prev, name: val, nameFr: val };
      if (!editingProduct) {
        updated.slug = val
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      return updated;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMessage(null);
    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        setErrorMessage(resJson.error || 'Erreur lors de l\'upload');
        return;
      }

      setForm((prev) => ({ ...prev, mainImage: resJson.url }));
    } catch {
      setErrorMessage('Échec du téléchargement');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    const payload = {
      id: editingProduct?.id,
      name: form.nameFr || form.name,
      nameFr: form.nameFr || form.name,
      nameAr: form.nameAr,
      slug: form.slug,
      categoryId: Number(form.categoryId),
      basePrice: parseFloat(form.basePrice) || 0,
      mainImage: form.mainImage || '/images/products/placeholder.webp',
      subtitleFr: form.subtitleFr,
      subtitleAr: form.subtitleAr,
      descriptionFr: form.descriptionFr,
      descriptionAr: form.descriptionAr,
      ingredientsFr: form.ingredientsFr,
      ingredientsAr: form.ingredientsAr,
      usageFr: form.usageFr,
      usageAr: form.usageAr,
      isActive: form.isActive,
    };

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        setErrorMessage(resJson.error || 'Erreur lors de l\'enregistrement');
        setSaving(false);
        return;
      }

      setModalOpen(false);
      loadData();
    } catch {
      setErrorMessage('Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (p: Product) => {
    try {
      await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: p.id,
          isActive: !p.isActive,
        }),
      });
      setProducts((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, isActive: !item.isActive } : item))
      );
    } catch (err) {
      console.error('Error toggling product status:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setDeleteConfirmId(null);
      } else {
        alert(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.nameAr && p.nameAr.includes(search)) ||
      p.slug.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      filterCategory === 'all' || String(p.categoryId) === filterCategory;

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && p.isActive) ||
      (filterStatus === 'inactive' && !p.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#123D35]">Gestion des Produits</h1>
          <p className="text-xs text-[#64746E]">
            Ajoutez, modifiez ou retirez des soins et cosmétiques AL HURRA
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#123D35] hover:bg-[#1A5449] text-[#FAF7F2] font-semibold px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer text-sm"
        >
          <Plus className="w-4 h-4 text-[#DFB26E]" />
          <span>Ajouter un Produit</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#2D3533]/10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, arabe, slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8F4EC]/60 border border-[#2D3533]/10 rounded-xl focus:outline-none focus:border-[#123D35]"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-[#F8F4EC]/60 border border-[#2D3533]/10 rounded-xl focus:outline-none focus:border-[#123D35]"
          >
            <option value="all">Toutes les Catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-[#F8F4EC]/60 border border-[#2D3533]/10 rounded-xl focus:outline-none focus:border-[#123D35]"
          >
            <option value="all">Tous les Statuts</option>
            <option value="active">Actifs uniquement</option>
            <option value="inactive">Inactifs uniquement</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#2D3533]/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#123D35] flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#123D35] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">Chargement des produits...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-[#64746E] space-y-2">
            <Package className="w-10 h-10 mx-auto text-gray-300" />
            <p className="text-sm font-semibold text-[#123D35]">Aucun produit trouvé</p>
            <p className="text-xs text-gray-400">
              Modifiez votre recherche ou cliquez sur &quot;Ajouter un Produit&quot;.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#64746E] uppercase tracking-wider font-semibold border-b border-[#2D3533]/10">
                <tr>
                  <th className="py-3.5 px-4">Produit</th>
                  <th className="py-3.5 px-4">Catégorie</th>
                  <th className="py-3.5 px-4">Prix de Base</th>
                  <th className="py-3.5 px-4">Variantes</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    {/* Product Main Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-[#F8F4EC] relative overflow-hidden shrink-0 border border-[#2D3533]/10">
                          {p.mainImage ? (
                            <Image
                              src={p.mainImage}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400 m-auto mt-3" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[#123D35] flex items-center gap-2">
                            <span>{p.name}</span>
                            <a
                              href={`/boutique/${p.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gray-400 hover:text-[#C89748]"
                              title="Voir sur le site"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </p>
                          {p.nameAr && (
                            <p className="text-[11px] text-[#64746E] font-medium" dir="rtl">
                              {p.nameAr}
                            </p>
                          )}
                          <p className="text-[10px] text-gray-400 font-mono">/{p.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#123D35]/10 text-[#123D35]">
                        <Layers className="w-3 h-3 text-[#C89748]" />
                        {p.category?.name || 'Sans catégorie'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-sm text-[#123D35]">
                        {Number(p.basePrice).toFixed(2)} MAD
                      </span>
                    </td>

                    {/* Variants Count */}
                    <td className="py-3.5 px-4">
                      <a
                        href="/admin/variants"
                        className="inline-flex items-center gap-1 text-[11px] text-[#64746E] hover:text-[#123D35] bg-[#F8F4EC] px-2 py-1 rounded-lg border border-[#2D3533]/10"
                      >
                        <Sparkles className="w-3 h-3 text-[#C89748]" />
                        <span>{p.variants?.length || 0} variante(s)</span>
                      </a>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                          p.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.isActive ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        />
                        <span>{p.isActive ? 'Actif' : 'Inactif'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-gray-500 hover:text-[#123D35] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-serif font-bold text-[#123D35]">Supprimer ce produit ?</h3>
              <p className="text-xs text-[#64746E] mt-1">
                Cette action supprimera définitivement le produit et toutes ses variantes associées.
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow cursor-pointer"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full my-8 p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#123D35]">
                  {editingProduct ? 'Modifier le Produit' : 'Nouveau Produit'}
                </h3>
                <p className="text-xs text-[#64746E]">
                  Renseignez les informations bilingues (FR / AR) et les détails du soin.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row: Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#123D35] mb-1">
                    Nom du Produit (Français) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nameFr}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: Savon Naturel à l'Argan"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123D35] mb-1">
                    Nom du Produit (Arabe)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={form.nameAr}
                    onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                    placeholder="مثال: صابون طبيعي بزيت الأركان"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                  />
                </div>
              </div>

              {/* Row: Slug, Category, Base Price */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#123D35] mb-1">
                    Slug d&apos;URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="savon-naturel-argan"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#123D35] mb-1">
                    Catégorie *
                  </label>
                  <select
                    required
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#123D35] mb-1">
                    Prix de Base (MAD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.basePrice}
                    onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                    placeholder="150"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                  />
                </div>
              </div>

              {/* Main Image Upload or URL */}
              <div>
                <label className="block text-xs font-semibold text-[#123D35] mb-1">
                  Image Principale
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#FAF7F2] border border-[#2D3533]/15 relative overflow-hidden shrink-0 flex items-center justify-center">
                    {form.mainImage ? (
                      <Image
                        src={form.mainImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={form.mainImage}
                      onChange={(e) => setForm({ ...form, mainImage: e.target.value })}
                      placeholder="/images/products/votre-image.webp ou URL"
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#123D35]/10 hover:bg-[#123D35]/20 text-[#123D35] text-xs font-medium cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#C89748]" />
                      <span>{uploadingImage ? 'Téléversement...' : 'Téléverser un fichier local'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Subtitles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#123D35] mb-1">
                    Sous-titre (Français)
                  </label>
                  <input
                    type="text"
                    value={form.subtitleFr}
                    onChange={(e) => setForm({ ...form, subtitleFr: e.target.value })}
                    placeholder="Ex: Soin nourrissant aux extraits précieux"
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123D35] mb-1">
                    Sous-titre (Arabe)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={form.subtitleAr}
                    onChange={(e) => setForm({ ...form, subtitleAr: e.target.value })}
                    placeholder="مثال: عناية مغذية بمستخلصات ثمينة"
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#123D35] mb-1">
                    Description (Français)
                  </label>
                  <textarea
                    rows={3}
                    value={form.descriptionFr}
                    onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })}
                    placeholder="Description complète du produit..."
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123D35] mb-1">
                    Description (Arabe)
                  </label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={form.descriptionAr}
                    onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                    placeholder="الوصف الكامل للمنتج..."
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#123D35] mb-1">
                    Ingrédients (Français)
                  </label>
                  <textarea
                    rows={2}
                    value={form.ingredientsFr}
                    onChange={(e) => setForm({ ...form, ingredientsFr: e.target.value })}
                    placeholder="Huile d'argan bio, vitamine E..."
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123D35] mb-1">
                    Ingrédients (Arabe)
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={form.ingredientsAr}
                    onChange={(e) => setForm({ ...form, ingredientsAr: e.target.value })}
                    placeholder="زيت الأركان العضوي، فيتامين هـ..."
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                  />
                </div>
              </div>

              {/* Usage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#123D35] mb-1">
                    Conseils d&apos;utilisation (Français)
                  </label>
                  <textarea
                    rows={2}
                    value={form.usageFr}
                    onChange={(e) => setForm({ ...form, usageFr: e.target.value })}
                    placeholder="Appliquer matin et soir..."
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#123D35] mb-1">
                    Conseils d&apos;utilisation (Arabe)
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={form.usageAr}
                    onChange={(e) => setForm({ ...form, usageAr: e.target.value })}
                    placeholder="يستخدم صباحا ومساء..."
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#123D35] focus:ring-[#C89748]"
                />
                <label htmlFor="isActiveToggle" className="text-xs font-medium text-[#123D35] cursor-pointer">
                  Produit actif et visible immédiatement sur la boutique
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#123D35] hover:bg-[#1A5449] text-[#FAF7F2] text-xs font-semibold rounded-xl shadow cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-[#FAF7F2] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 text-[#DFB26E]" />
                  )}
                  <span>{editingProduct ? 'Enregistrer les modifications' : 'Créer le Produit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
