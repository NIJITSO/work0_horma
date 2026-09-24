'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Layers,
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  Upload,
  AlertTriangle,
  Package
} from 'lucide-react';

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deleteConfirmCat, setDeleteConfirmCat] = useState<CategoryItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    isActive: true,
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm({
      name: '',
      slug: '',
      description: '',
      image: '',
      isActive: true,
    });
    setErrorMessage(null);
    setModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || '',
      isActive: cat.isActive,
    });
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setForm((prev) => {
      const updated = { ...prev, name: val };
      if (!editingCategory) {
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

      setForm((prev) => ({ ...prev, image: resJson.url }));
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
      id: editingCategory?.id,
      name: form.name,
      slug: form.slug,
      description: form.description,
      image: form.image,
      isActive: form.isActive,
    };

    try {
      const method = editingCategory ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/categories', {
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
      loadCategories();
    } catch {
      setErrorMessage('Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        setDeleteConfirmCat(null);
      } else {
        alert(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#123D35]">Gestion des Catégories</h1>
          <p className="text-xs text-[#64746E]">
            Organisez les rayons de la boutique (Soins du visage, Savons, Huiles & Sérums, etc.)
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#123D35] hover:bg-[#1A5449] text-[#FAF7F2] font-semibold px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer text-sm"
        >
          <Plus className="w-4 h-4 text-[#DFB26E]" />
          <span>Nouvelle Catégorie</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#2D3533]/10 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8F4EC]/60 border border-[#2D3533]/10 rounded-xl focus:outline-none focus:border-[#123D35]"
          />
        </div>
        <span className="text-xs text-[#64746E] font-medium hidden sm:inline">
          {categories.length} catégorie(s) au total
        </span>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-[#123D35] flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#123D35] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">Chargement des catégories...</span>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="col-span-full p-12 text-center text-[#64746E] bg-white rounded-2xl border border-[#2D3533]/10">
            <Layers className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-[#123D35]">Aucune catégorie trouvée</p>
          </div>
        ) : (
          filteredCategories.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-[#2D3533]/10 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#2D3533]/10 overflow-hidden relative shrink-0 flex items-center justify-center">
                      {c.image ? (
                        <Image
                          src={c.image}
                          alt={c.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <Layers className="w-6 h-6 text-[#123D35]/40" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#123D35]">{c.name}</h3>
                      <p className="text-[11px] text-gray-400 font-mono">/{c.slug}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {c.description && (
                  <p className="text-xs text-[#64746E] line-clamp-2 mb-4 leading-relaxed">
                    {c.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs text-[#123D35] font-semibold bg-[#F8F4EC] px-2.5 py-1 rounded-lg">
                  <Package className="w-3.5 h-3.5 text-[#C89748]" />
                  <span>{c._count?.products || 0} produit(s)</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-1.5 text-gray-500 hover:text-[#123D35] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmCat(c)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmCat && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-serif font-bold text-[#123D35]">
                Supprimer &quot;{deleteConfirmCat.name}&quot; ?
              </h3>
              <p className="text-xs text-[#64746E] mt-1">
                {(deleteConfirmCat._count?.products || 0) > 0 ? (
                  <span className="text-rose-600 font-semibold">
                    Attention : {deleteConfirmCat._count?.products} produit(s) sont rattachés à cette catégorie. Vous devez d&apos;abord réassigner ou supprimer ces produits.
                  </span>
                ) : (
                  'Cette catégorie ne contient aucun produit et peut être supprimée en toute sécurité.'
                )}
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setDeleteConfirmCat(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmCat.id)}
                disabled={(deleteConfirmCat._count?.products || 0) > 0}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#123D35]">
                  {editingCategory ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
                </h3>
                <p className="text-xs text-[#64746E]">
                  Définissez le nom, le slug et la vignette de présentation.
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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#123D35] mb-1">
                  Nom de la Catégorie *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Soins du Corps"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#123D35] mb-1">
                  Slug d&apos;URL *
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="soins-du-corps"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#123D35] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description de la catégorie..."
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                />
              </div>

              {/* Category Image */}
              <div>
                <label className="block text-xs font-semibold text-[#123D35] mb-1">
                  Image / Vignette
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#FAF7F2] border border-[#2D3533]/15 relative overflow-hidden shrink-0 flex items-center justify-center">
                    {form.image ? (
                      <Image
                        src={form.image}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <Layers className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="/images/categories/soins.webp ou URL"
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl focus:outline-none focus:border-[#123D35]"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#123D35]/10 hover:bg-[#123D35]/20 text-[#123D35] text-xs font-medium cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#C89748]" />
                      <span>{uploadingImage ? 'Téléversement...' : 'Téléverser image'}</span>
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

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#123D35] focus:ring-[#C89748]"
                />
                <label htmlFor="catActive" className="text-xs font-medium text-[#123D35] cursor-pointer">
                  Catégorie active et visible sur le site
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#123D35] hover:bg-[#1A5449] text-[#FAF7F2] text-xs font-semibold rounded-xl shadow cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-[#FAF7F2] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 text-[#DFB26E]" />
                  )}
                  <span>{editingCategory ? 'Mettre à jour' : 'Créer la Catégorie'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
