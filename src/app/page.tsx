'use client';

import { useEffect, useState } from 'react';

type RuleCategory = '人縛り' | 'コイン縛り' | 'ギフト縛り';

type BattleRule = {
  id: number;
  category: RuleCategory;
  title: string;
  description: string;
};

type HistoryItem = BattleRule & {
  drawnAt: string;
};

const categories = ['すべて', '人縛り', 'コイン縛り', 'ギフト縛り'] as const;
type CategoryFilter = (typeof categories)[number];

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

export default function Home() {
  const [rules, setRules] = useState<BattleRule[]>([]);
  const [category, setCategory] = useState<CategoryFilter>('すべて');
  const [selectedRule, setSelectedRule] = useState<BattleRule | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState('');
  const [isRolling, setIsRolling] = useState(false);

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

  const getFilteredRules = () => {
    return category === 'すべて'
      ? rules
      : rules.filter((rule) => rule.category === category);
  };

  const getCategoryCount = (targetCategory: CategoryFilter) => {
    if (targetCategory === 'すべて') {
      return rules.length;
    }

    return rules.filter((rule) => rule.category === targetCategory).length;
  };

  const drawRule = () => {
    if (isRolling) return;

    const filteredRules = getFilteredRules();

    if (filteredRules.length === 0) {
      setError('選択したカテゴリにルールがありません。');
      return;
    }

    setError('');
    setIsRolling(true);

    let count = 0;
    const maxCount = 25;

    const intervalId = window.setInterval(() => {
      const randomRule =
        filteredRules[Math.floor(Math.random() * filteredRules.length)];

      setSelectedRule(randomRule);

      count++;

      if (count >= maxCount) {
        window.clearInterval(intervalId);

        const result =
          filteredRules[Math.floor(Math.random() * filteredRules.length)];

        const now = new Date();

        const drawnAt = now.toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        setSelectedRule(result);

        setHistory((prev) =>
          [{ ...result, drawnAt }, ...prev].slice(0, 20)
        );

        setIsRolling(false);
      }
    }, 60);
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-xl">
        <header className="mb-8 text-center">
          <p className="text-sm text-zinc-400">TikTok LIVE Battle</p>

          <h1 className="mt-2 text-3xl font-bold">
            限定バトル ルール抽選
          </h1>
        </header>

        <section className="rounded-2xl bg-zinc-900 p-5 shadow-lg">
          <label className="mb-3 block text-sm font-bold">
            カテゴリ（フィルター）
          </label>

          <div className="space-y-3">
            {categories.map((item) => {
              const isSelected = category === item;
              const count = getCategoryCount(item);

              const badgeClass =
                item === 'すべて'
                  ? 'bg-zinc-600'
                  : categoryColors[item as RuleCategory];

              const icon =
                item === 'すべて'
                  ? '🎲'
                  : categoryIcons[item as RuleCategory];

              return (
                <button
                  key={item}
                  type="button"
                  disabled={isRolling}
                  onClick={() => setCategory(item)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    isSelected
                      ? 'border-yellow-400 bg-zinc-800'
                      : 'border-zinc-700 bg-zinc-900'
                  } ${isRolling ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold text-white ${badgeClass}`}
                    >
                      <span>{icon}</span>
                      <span>{item}</span>
                    </span>

                    <span className="text-sm text-zinc-400">
                      {count}件
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={drawRule}
            disabled={isRolling}
            className="mt-5 w-full rounded-xl bg-white px-4 py-3 font-bold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRolling ? '抽選中...' : '抽選する'}
          </button>

          <a
            href="/rules"
            className="mt-3 block text-center text-sm text-zinc-400 underline"
          >
            登録ルール一覧を見る
          </a>

          {error && (
            <p className="mt-4 rounded-xl bg-red-500/20 p-3 text-sm text-red-200">
              {error}
            </p>
          )}
        </section>

        {selectedRule && (
          <section
            className={`mt-6 rounded-2xl border-2 bg-zinc-900 p-8 text-center shadow-xl ${
              isRolling
                ? 'border-zinc-500 opacity-80'
                : 'border-yellow-400'
            }`}
          >
            <div className="flex justify-center">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white ${
                  categoryColors[selectedRule.category]
                }`}
              >
                <span>{categoryIcons[selectedRule.category]}</span>
                <span>{selectedRule.category}</span>
              </span>
            </div>

            <p className="mt-4 text-sm font-bold text-zinc-400">
              {isRolling ? '抽選中...' : '抽選結果'}
            </p>

            <h2 className="mt-3 text-4xl font-extrabold">
              {selectedRule.title}
            </h2>

            <p className="mt-4 text-lg text-zinc-300">
              {selectedRule.description}
            </p>
          </section>
        )}

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold">履歴</h2>

          {history.length === 0 ? (
            <p className="text-sm text-zinc-500">
              まだ抽選履歴はありません。
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-zinc-700">
              <table className="min-w-[560px] w-full text-left">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="px-3 py-2 text-sm">No</th>
                    <th className="px-3 py-2 text-sm">カテゴリ</th>
                    <th className="px-3 py-2 text-sm">ルール</th>
                    <th className="px-3 py-2 text-sm">時刻</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((rule, index) => (
                    <tr
                      key={`${rule.id}-${index}`}
                      className="border-t border-zinc-700"
                    >
                      <td className="px-3 py-2">{index + 1}</td>

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
                        {rule.drawnAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl bg-zinc-900 p-5 text-sm text-zinc-300">
          <h2 className="text-xl font-bold text-white">
            このアプリについて
          </h2>

          <p className="mt-3 leading-7">
            本アプリは、TikTok LIVEのバトルで行われる
            「限定バトル」のルールをランダムに抽選するためのアプリです。
            カテゴリを選択して抽選することで、
            配信中に使うルールを簡単に決めることができます。
          </p>

          <h3 className="mt-5 font-bold text-white">
            カテゴリ概要
          </h3>

          <ul className="mt-3 space-y-2">
            <li>
              <span className="font-bold text-blue-300">
                👥 人縛り：
              </span>
              投げられる人を制限します。
            </li>

            <li>
              <span className="font-bold text-green-300">
                🪙 コイン縛り：
              </span>
              使用できるコイン数を制限します。
            </li>

            <li>
              <span className="font-bold text-purple-300">
                🎁 ギフト縛り：
              </span>
              使用できるギフトの種類を制限します。
            </li>
          </ul>
        </section>

        <section className="mt-8 rounded-2xl bg-zinc-900 p-5 text-sm text-zinc-300">
          <h2 className="text-xl font-bold text-white">
            改善要望、お問い合わせ先
          </h2>

          <p className="mt-3 leading-7">
            みそ🎨🐾 @miso_eg ※TikTok
            <br />
            上記アカウントのDM or 投稿コメントまで
          </p>
        </section>
      </div>
    </main>
  );
}