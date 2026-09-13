const HISTORY = {
  iran: [
    {
      id: "cyrus",
      title: "کوروش بزرگ",
      type: "figure",
      period: "هخامنشی",
      description: "بنیان‌گذار شاهنشاهی هخامنشی و یکی از مهم‌ترین فرمانروایان تاریخ ایران."
    },
    {
      id: "achaemenid",
      title: "شاهنشاهی هخامنشی",
      type: "empire",
      period: "حدود 550 تا 330 پیش از میلاد",
      description: "یکی از بزرگ‌ترین امپراتوری‌های جهان باستان."
    },
    {
      id: "sassanid",
      title: "شاهنشاهی ساسانی",
      type: "empire",
      period: "224 تا 651 میلادی",
      description: "یکی از قدرت‌های بزرگ ایران باستان و رقیب اصلی روم."
    },
    {
      id: "safavid",
      title: "صفویان",
      type: "dynasty",
      period: "1501 تا 1736 میلادی",
      description: "دودمانی مهم در تاریخ ایران که نقش بزرگی در شکل‌گیری ایران دوران جدید داشت."
    }
  ],

  world: [
    {
      id: "rome",
      title: "امپراتوری روم",
      type: "empire",
      period: "27 پیش از میلاد تا 476 میلادی",
      description: "یکی از تأثیرگذارترین دولت‌های جهان باستان."
    },
    {
      id: "egypt",
      title: "مصر باستان",
      type: "civilization",
      period: "دوران باستان",
      description: "یکی از تمدن‌های بزرگ و پایدار جهان باستان."
    },
    {
      id: "greece",
      title: "یونان باستان",
      type: "civilization",
      period: "دوران باستان",
      description: "مرکز مهم فلسفه، هنر، سیاست و دانش در جهان باستان."
    }
  ],

  wars: [
    {
      id: "ww1",
      title: "جنگ جهانی اول",
      type: "war",
      period: "1914 تا 1918",
      description: "یکی از بزرگ‌ترین جنگ‌های تاریخ مدرن."
    },
    {
      id: "ww2",
      title: "جنگ جهانی دوم",
      type: "war",
      period: "1939 تا 1945",
      description: "بزرگ‌ترین جنگ تاریخ از نظر گستره جهانی."
    }
  ],

  empires: [
    {
      id: "achaemenid",
      title: "هخامنشیان",
      type: "empire",
      period: "550 تا 330 پیش از میلاد",
      description: "شاهنشاهی هخامنشی."
    },
    {
      id: "roman",
      title: "روم",
      type: "empire",
      period: "27 پیش از میلاد تا 476 میلادی",
      description: "امپراتوری روم."
    },
    {
      id: "mongol",
      title: "امپراتوری مغول",
      type: "empire",
      period: "قرن 13 و 14 میلادی",
      description: "یکی از بزرگ‌ترین امپراتوری‌های پیوسته تاریخ."
    },
    {
      id: "ottoman",
      title: "امپراتوری عثمانی",
      type: "empire",
      period: "1299 تا 1922",
      description: "امپراتوری بزرگ اوراسیایی."
    }
  ]
};


function json(data, status = 200) {
  return new Response(
    JSON.stringify(data, null, 2),
    {
      status,
      headers: {
        "content-type": "application/json; charset=UTF-8",
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,OPTIONS",
        "access-control-allow-headers": "Content-Type, Authorization"
      }
    }
  );
}


function allHistory() {
  return [
    ...HISTORY.iran,
    ...HISTORY.world,
    ...HISTORY.wars,
    ...HISTORY.empires
  ];
}


async function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === "OPTIONS") {
    return json({ success: true });
  }

  // Health
  if (path === "/api/health") {
    return json({
      success: true,
      service: "Sedaye Tarikh API",
      status: "online",
      version: "1.0.0"
    });
  }


  // API information
  if (path === "/api") {
    return json({
      name: "Sedaye Tarikh API",
      version: "1.0.0",
      endpoints: [
        "/api/health",
        "/api/history",
        "/api/iran",
        "/api/world",
        "/api/wars",
        "/api/empires",
        "/api/search?q=",
        "/api/history/:id"
      ]
    });
  }


  // All history
  if (path === "/api/history") {
    return json({
      success: true,
      count: allHistory().length,
      data: allHistory()
    });
  }


  // Iran
  if (path === "/api/iran") {
    return json({
      success: true,
      category: "iran",
      count: HISTORY.iran.length,
      data: HISTORY.iran
    });
  }


  // World
  if (path === "/api/world") {
    return json({
      success: true,
      category: "world",
      count: HISTORY.world.length,
      data: HISTORY.world
    });
  }


  // Wars
  if (path === "/api/wars") {
    return json({
      success: true,
      category: "wars",
      count: HISTORY.wars.length,
      data: HISTORY.wars
    });
  }


  // Empires
  if (path === "/api/empires") {
    return json({
      success: true,
      category: "empires",
      count: HISTORY.empires.length,
      data: HISTORY.empires
    });
  }


  // Search
  if (path === "/api/search") {
    const q = (url.searchParams.get("q") || "")
      .trim()
      .toLowerCase();

    if (!q) {
      return json({
        success: false,
        error: "Search query is required"
      }, 400);
    }

    const results = allHistory().filter(item => {
      const text = `
        ${item.title}
        ${item.type}
        ${item.period}
        ${item.description}
      `.toLowerCase();

      return text.includes(q);
    });

    return json({
      success: true,
      query: q,
      count: results.length,
      data: results
    });
  }


  // Single historical item
  if (path.startsWith("/api/history/")) {
    const id = path.split("/").pop();

    const item = allHistory().find(
      x => x.id === id
    );

    if (!item) {
      return json({
        success: false,
        error: "Historical item not found"
      }, 404);
    }

    return json({
      success: true,
      data: item
    });
  }


  return json({
    success: false,
    error: "Endpoint not found"
  }, 404);
}


export default {
  fetch: handleRequest
};
