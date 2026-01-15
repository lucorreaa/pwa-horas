<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="theme-color" content="#111827" />
  <title>Calculadora de Horas</title>
  <link rel="manifest" href="manifest.json" />

  <style>
    :root{
      --bg:#0b1220; --card:#0f172a; --muted:#94a3b8; --text:#e5e7eb;
      --border:rgba(148,163,184,.22);
      --btn:#2563eb;
      --good:#22c55e; --bad:#ef4444;
      --shadow: 0 10px 30px rgba(0,0,0,.35);
      --radius:18px;
    }
    [data-theme="light"]{
      --bg:#f5f7fb; --card:#ffffff; --muted:#475569; --text:#0f172a;
      --border:rgba(15,23,42,.14);
    }

    *{box-sizing:border-box}
    body{
      margin:0;
      font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;
      background:var(--bg);
      color:var(--text);
      min-height:100vh;
      display:flex;
      justify-content:center;
      padding:24px;
    }

    .wrap{width:min(680px,100%)}
    header{display:flex;justify-content:space-between;margin-bottom:16px}
    h1{font-size:20px;margin:0}
    .sub{font-size:13px;color:var(--muted)}

    .card{
      background:rgba(255,255,255,.02);
      border:1px solid var(--border);
      border-radius:18px;
      box-shadow:var(--shadow);
    }
    .cardInner{padding:18px}

    /* ===== INPUTS (TOPO) ===== */
    .grid{
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:12px;
    }
    @media (max-width:640px){
      .grid{
        grid-template-columns:1fr;
        max-width:380px;
        margin:0 auto;
      }
    }

    /* transforma cada campo em "balão" */
    .grid > div{
      border:1px solid var(--border);
      border-radius:16px;
      padding:14px;
      background:rgba(255,255,255,.02);
    }

    .grid label{
      font-size:12px;
      color:var(--muted);
      margin-bottom:6px;
      display:block;
    }

    .grid input{
      width:100%;
      border:none;
      background:transparent;
      color:var(--text);
      font-size:15px;
      outline:none;
      padding:0;
    }

    /* ===== BOTÕES ===== */
    .row{
      margin-top:14px;
      display:flex;
      justify-content:space-between;
      gap:10px;
      flex-wrap:wrap;
    }
    @media (max-width:640px){
      .row{
        max-width:380px;
        margin-left:auto;
        margin-right:auto;
      }
    }

    button{
      border:none;
      padding:11px 14px;
      border-radius:14px;
      background:var(--btn);
      color:#fff;
      font-weight:600;
      cursor:pointer;
    }
    button.secondary{background:transparent;border:1px solid var(--border);color:var(--text)}
    button.ghost{background:transparent;color:var(--text)}

    /* ===== RESULTADOS (EMBAIXO – INTACTOS) ===== */
    .results{
      margin-top:14px;
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:12px;
    }
    @media (max-width:640px){
      .results{grid-template-columns:1fr}
    }

    .box{
      border:1px solid var(--border);
      border-radius:16px;
      padding:14px;
      background:rgba(255,255,255,.02);
    }
    .k{font-size:12px;color:var(--muted)}
    .v{font-size:18px;font-weight:800}

    .hint{margin-top:10px;font-size:12px;color:var(--muted)}
  </style>
</head>

<body>
<div class="wrap">
  <header>
    <div>
      <h1>Calculadora de Horas</h1>
      <div class="sub">Entrada, saída, almoço e carga</div>
    </div>
  </header>

  <div class="card">
    <div class="cardInner">

      <div class="grid">
        <div>
          <label>Entrada</label>
          <input id="entrada" type="time" value="09:00">
        </div>
        <div>
          <label>Saída</label>
          <input id="saida" type="time" value="19:10">
        </div>
        <div>
          <label>Almoço (h)</label>
          <input id="almoco" type="number" step="0.25" value="1">
        </div>
        <div>
          <label>Carga (HH:MM)</label>
          <input id="carga" type="time" value="07:20">
        </div>
      </div>

      <div class="row">
        <button onclick="calc()">Calcular</button>
        <button class="secondary" onclick="save()">Salvar</button>
        <button class="ghost" onclick="clearAll()">Limpar</button>
      </div>

      <div class="results">
        <div class="box"><div class="k">Horas</div><div class="v" id="worked">—</div></div>
        <div class="box"><div class="k">Extra</div><div class="v" id="extra">—</div></div>
        <div class="box"><div class="k">Saldo</div><div class="v" id="saldo">—</div></div>
      </div>

      <div class="hint">Virada de dia funciona automaticamente.</div>
    </div>
  </div>
</div>

<script>
function msToHH(ms){
  const s=Math.abs(ms)/1000|0,h=s/3600|0,m=(s%3600)/60|0;
  return (ms<0?"-":"")+`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}
function tms(t){const[d,m]=t.split(":");return(+d*60+ +m)*60000}

function calc(){
  const e=tms(entrada.value),s=tms(saida.value)+(tms(saida.value)<e?86400000:0);
  const w=s-e-(almoco.value*3600000);
  const b=tms(carga.value);
  worked.textContent=msToHH(w);
  extra.textContent=msToHH(Math.max(0,w-b));
  saldo.textContent=msToHH(w-b);
}
function save(){
  localStorage.setItem("pwa_horas",JSON.stringify({
    entrada:entrada.value,saida:saida.value,almoco:almoco.value,carga:carga.value
  }));
}
function clearAll(){
  localStorage.removeItem("pwa_horas");
  worked.textContent=extra.textContent=saldo.textContent="—";
}
(function(){
  const d=JSON.parse(localStorage.getItem("pwa_horas")||"{}");
  entrada.value=d.entrada||"09:00";
  saida.value=d.saida||"18:00";
  almoco.value=d.almoco||1;
  carga.value=d.carga||"07:20";
})();
</script>
</body>
</html>
