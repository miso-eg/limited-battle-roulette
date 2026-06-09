'use client';

import { useEffect, useState } from 'react';

type RuleCategory = '人縛り' | 'コイン縛り' | 'ギフト縛り';

type BattleRule = {
  id: number;
  category: RuleCategory;
  title: string;
  description: string;
};

const categoryColors: Record<RuleCategory, string> = {
  人縛り: 'bg-blue-500',
  コイン縛り: 'bg-green-500',
  ギフト縛り: 'bg-purple-500',
};

const categoryIcons: Record<RuleCategory, string> = {
  人縛り: '👥',
  コイン縛り: '🪙',
  ギフト縛り: '🎁',
};

export default function RulesPage() {
  const [rules, setRules] = useState<BattleRule[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRules = async () => {
      try {
        const response = await fetch('/rules.csv');

        if (!response.ok) {
          throw new Error();
        }

        const buffer = await response.arrayBuffer();
        const text = new TextDecoder('shift_jis').decode(buffer);
        const parsedRules = parseCsv(text);

        setRules(parsedRules);
      } catch {
        setError('ルールファイルの読み込みに失敗しました。');
      }
    };

    loadRules();
  }, []);

  const parseCsv = (csvText: string): BattleRule[] => {
    const lines = csvText.trim().split(/\r?\n/);
    const dataLines = lines.slice(1);

    return dataLines
      .map((line) => {
        const [id, category, title, description] = line.split(',');

        return {
          id: Number(id),
          category: category as RuleCategory,
          title,
          description,
        };
      })
      .filter((rule) => rule.id && rule.category && rule.title);
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 text-center">
          <p className="text-sm text-zinc-400">Rule List</p>
          <h1 className="mt-2 text-3xl font-bold">登録ルール一覧</h1>
        </header>

        <div className="mb-5 text-center">
          <a
            href="/"
            className="inline-block rounded-xl bg-white px-4 py-2 font-bold text-zinc-950"
          >
            抽選ページへ戻る
          </a>
        </div>

        {error && (
          <p className="rounded-xl bg-red-500/20 p-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <section className="rounded-2xl bg-zinc-900 p-5">
          <h2 className="mb-4 text-xl font-bold">
            登録件数：{rules.length}件
          </h2>

          <div className="overflow-x-auto rounded-xl border border-zinc-700">
            <table className="min-w-[640px] w-full text-left">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-3 py-2 text-sm">ID</th>
                  <th className="px-3 py-2 text-sm">カテゴリ</th>
                  <th className="px-3 py-2 text-sm">ルール</th>
                  <th className="px-3 py-2 text-sm">説明</th>
                </tr>
              </thead>

              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id} className="border-t border-zinc-700">
                    <td className="px-3 py-2 text-sm text-zinc-400">
                      {rule.id}
                    </td>

                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold text-white ${
                          categoryColors[rule.category]
                        }`}
                      >
                        <span>{categoryIcons[rule.category]}</span>
                        <span>{rule.category}</span>
                      </span>
                    </td>

                    <td className="px-3 py-2 font-semibold">
                      {rule.title}
                    </td>

                    <td className="px-3 py-2 text-sm text-zinc-400">
                      {rule.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}