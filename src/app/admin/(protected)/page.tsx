export default function AdminDashboardPage() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          Dashboard
        </p>
        <h2 className="text-3xl font-semibold tracking-tight">后台首页</h2>
      </div>
      <p className="max-w-2xl text-sm leading-7 text-slate-300">
        后台鉴权链路已经接通。下一阶段会在这里接入商品、分类、Banner、留言和订阅管理能力。
      </p>
    </section>
  );
}
