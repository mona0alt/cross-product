import React from 'react';
import Link from 'next/link';

import { getAdminCategoryTree, getAdminProductList } from '@/features/catalog/queries';

function flattenCategories(
  nodes: Awaited<ReturnType<typeof getAdminCategoryTree>>,
  prefix = ''
): Array<{ id: string; label: string }> {
  return nodes.flatMap((node) => {
    const label = prefix ? `${prefix} / ${node.nameZh}` : node.nameZh;

    return [
      { id: node.id, label },
      ...flattenCategories(node.children, label)
    ];
  });
}

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAdminProductList({}),
    getAdminCategoryTree()
  ]);
  const categoryOptions = flattenCategories(categories);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Products
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            商品管理
          </h2>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex rounded-full bg-amber-300 px-5 py-3 text-sm font-medium text-slate-950"
        >
          新建商品
        </Link>
      </div>

      <form className="grid gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-5 md:grid-cols-3 xl:grid-cols-4">
        <select className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100">
          <option value="">全部状态</option>
          <option value="draft">draft</option>
          <option value="pending">pending</option>
          <option value="published">published</option>
          <option value="archived">archived</option>
        </select>
        <select className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100">
          <option value="">全部分类</option>
          {categoryOptions.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
        <input
          className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          placeholder="关键词搜索"
        />
        <button
          type="button"
          className="rounded-full bg-slate-100 px-5 py-3 text-sm font-medium text-slate-950"
        >
          查询
        </button>
      </form>

      <div className="overflow-hidden rounded-3xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 bg-slate-900/70 text-sm text-slate-200">
          <thead className="bg-slate-950/70 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">编码</th>
              <th className="px-4 py-3 text-left">名称</th>
              <th className="px-4 py-3 text-left">分类</th>
              <th className="px-4 py-3 text-left">状态</th>
              <th className="px-4 py-3 text-left">推荐</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">{product.productCode}</td>
                <td className="px-4 py-3">{product.nameZh}</td>
                <td className="px-4 py-3">{product.category.nameZh}</td>
                <td className="px-4 py-3">{product.status}</td>
                <td className="px-4 py-3">
                  {product.isRecommended ? '是' : '否'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
