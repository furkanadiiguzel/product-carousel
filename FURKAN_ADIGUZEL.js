(function () {
	// Config
	const TITLE = "Beğenebileceğinizi Düşündüklerimiz";
	const DATA_URL = "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json";
	const LS_PRODUCTS = "furkan_product_list";
	const LS_FAVS = "furkan_product_favourites";

	// State
	let favourites = new Set();

	// Entry
	init();
	function init() {
		if (!onHome()) {
			console.log("wrong page");
			return;
		}
		buildCSS();
		buildHTML();
		wireEvents();
	}

	function onHome() {
		try {
			const hostOk = /(^|\.)e-bebek\.com$/.test(location.hostname);
			const pathOk = location.pathname === "/" || location.pathname === "";
			return hostOk && pathOk;
		} catch (_) {
			return false;
		}
	}

	function buildCSS() {
		const css = `
		.furkan-scope {
            overflow-x: hidden;
            display: block;
            width: 100%;
            position: relative;
            left: 50%;
            transform: translateX(-50%);
            max-width: 1280px;
            padding: 0 16px;
        }
		.furkan-scope .furkan-carousel-wrapper {
			position: relative;
			display: block;
			width: 100%;
			overflow: visible; /* allow arrows to extend outside */
		}
		.furkan-scope .furkan-product-carousel {
			display: flex;
			overflow-x: auto;
			gap: 15px;
			padding: 20px 16px;
			scroll-behavior: smooth;
			width: 100%;
		}
		.furkan-scope .furkan-arrow {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			z-index: 2000;
			background-color: #fef6eb;
			border: none;
			cursor: pointer;
			font-size: 22px;
			color: #f39c33;
			width: 44px;
			height: 44px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 4px 12px rgba(0,0,0,0.15);
		}
		.furkan-scope .furkan-arrow-left { left: -20px; }
		.furkan-scope .furkan-arrow-right { right: -20px; }
		@media (min-width: 992px){
			.furkan-scope .furkan-arrow-left { left: -28px; }
			.furkan-scope .furkan-arrow-right { right: -28px; }
		}
		.furkan-scope .furkan-product-item {
			flex: 0 0 250px;
			border: 1px solid #eee;
			border-radius: 16px;
			position: relative;
			background: #fff;
			box-shadow: 0 2px 8px rgba(0,0,0,.06);
			overflow: hidden;
			padding-bottom: 16px;
		}
		.furkan-scope .furkan-product-item:hover{ border-color:#f4a640; box-shadow:0 0 0 2px #f4a640; }
		.furkan-scope .furkan-product-image {
			width: 100%;
			aspect-ratio: 1 / 1;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #fff;
		}
		.furkan-scope .furkan-product-image img { 
            max-width: 90%; 
            max-height: 90%; 
            object-fit: contain; 
        }
		.furkan-scope .furkan-product-info { 
            padding: 10px; 
        }
		.furkan-scope .furkan-stars{ color:#fdd000; font-size:14px; line-height:1; letter-spacing:2px; margin-top:8px; }
		.furkan-scope .furkan-brand { 
            font-size: 12px; color: #777; font-weight:700;
        }
		.furkan-scope .furkan-title { 
            font-size: 14px; 
            color: #1a1a1a; 
            line-height: 1.3; 
            min-height: 36px; 
        }
		.furkan-scope .furkan-prices { 
            display: flex; gap: 8px; align-items: baseline; 
        }
		.furkan-scope .furkan-price{
            font-weight:800; color:#1c7c2e; font-size:20px;
        }
		.furkan-scope .furkan-price.no-discount{ color:#1c1c1c; }
		.furkan-scope .furkan-orig{
            text-decoration:line-through; color:#9b9b9b; font-size:14px;
        }
		.furkan-scope .furkan-percent {
			font-weight: 700;
			color: #1c7c2e;
			font-size: 14px;
		}
		/* CTA button */
		.furkan-scope .furkan-cta{ padding:16px; margin-top:auto; }
		.furkan-scope .furkan-cta button{ width:100%; border:none; border-radius:28px; background:#fff6ec; color:#f18e00; font-weight:2000; padding:14px 16px; cursor:pointer; }
		.furkan-scope .furkan-heart {
			position: absolute;
			right: 12px; top: 12px;
			width: 40px; height: 40px; border-radius: 50%;
			background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.08);
			display: flex; align-items: center; justify-content: center;
			cursor: pointer;
		}
		.furkan-scope .furkan-heart::before { 
            content: '\\2661'; 
            color: #f26a20; 
            font-size: 20px; 
        }
		.furkan-scope .furkan-heart.furkan-favorited::before { 
            content: '\\2665'; 
            color: #f26a20; 
        }
		.furkan-scope .furkan-discount-badge { 
            position: absolute; 
            left: 12px; top: 12px; 
            background:#ffbf00; 
            color:#fff; 
            font-weight:700; 
            font-size:12px; 
            padding:4px 6px; 
            border-radius:10px; 
        }
		.furkan-scope .furkan-section-title { 
            font-size: 24px; 
            font-weight: 900; 
            margin: 8px 0 10px; 
            padding: 0 8px;
            background: transparent;
            color: #f39c2a;
            border-radius: 0;
            display: inline-block; 
            position: relative; z-index:1;
            text-transform: none; letter-spacing: .5px;
        }
        .furkan-scope .furkan-shell{
            position: relative;
            background:#fff;
            border:1px solid #eee;
            border-radius:24px;
            box-shadow:0 6px 20px rgba(0,0,0,.06);
            padding:16px 24px 8px;
            overflow: visible;
        }
        .furkan-scope .furkan-shell::before{
            content:"";
            position:absolute;
            top:0; left:0; right:0;
            height:72px;
            background:#fef5eb;
            border-radius:24px 24px 0 0;
            z-index:0;
        }
        @media (max-width: 991px){
            .furkan-scope .furkan-arrow-left { left: 8px; }
            .furkan-scope .furkan-arrow-right { right: 8px; }
        }
        @media (min-width: 1280px){
            .furkan-scope .furkan-arrow-left { left: -36px; }
            .furkan-scope .furkan-arrow-right { right: -36px; }
        }
        .furkan-scope .furkan-product-item{
            display:flex; flex-direction:column;
        }
        .furkan-scope .product-link{ display:flex; flex-direction:column; flex:1 1 auto; }
		`;
		let style = document.getElementById("furkan-carousel-style");
		if (!style) {
			style = document.createElement("style");
			style.id = "furkan-carousel-style";
			document.head.appendChild(style);
		}
		style.textContent = css;
	}

	function buildHTML() {
		const afterStories = findStories();
		const afterHero = findHeroBanner();
		//finding the hero container
		let heroContainer = null;
		if (afterHero) {
			const picture = afterHero.closest('picture');
			const heroDiv = afterHero.closest('div.hero.banner');
			const heroCmp = afterHero.closest('eb-hero-banner-carousel');
			heroContainer = heroDiv || heroCmp || picture || afterHero;
		}
		const root = document.createElement("section");
		const html = `
			<div class="furkan-scope" style="display: block; width: 100%; isolation: isolate;">
                <div class="furkan-shell">
                    <h2 class="furkan-section-title">${TITLE}</h2>
                    <div class="furkan-carousel-wrapper">
                        <button class="furkan-arrow furkan-arrow-left" aria-label="Önceki">&#8249;</button>
                        <div class="furkan-product-carousel"></div>
                        <button class="furkan-arrow furkan-arrow-right" aria-label="Sonraki">&#8250;</button>
                    </div>
                </div>
			</div>
		`;
		root.innerHTML = html;
		// Preferred placement: right after outermost hero container
		if (heroContainer && heroContainer.parentElement) {
			heroContainer.parentElement.insertBefore(root, heroContainer.nextSibling);
		} else if (afterStories && afterStories.parentNode) {
			//after stories
			afterStories.parentNode.insertBefore(root, afterStories.nextSibling);
		} else {
			// If not, append to body
			document.body.appendChild(root);
		}

		// data
		let data = null;
		try { data = JSON.parse(localStorage.getItem(LS_PRODUCTS) || "null"); } catch (_) {}
		if (Array.isArray(data)) {
			render(data);
			return;
		}
		fetch(DATA_URL)
			.then((r) => r.json())
			.then((json) => {
				localStorage.setItem(LS_PRODUCTS, JSON.stringify(json));
				render(json);
			})
			.catch((e) => console.error(e));
	}

	function render(products) {
		// favourites
		try { favourites = new Set(JSON.parse(localStorage.getItem(LS_FAVS) || "[]")); } catch (_) {}
		const track = document.querySelector(".furkan-product-carousel");
		products.forEach((p) => {
			const id = String(p.id || p.sku || p.code || p.url);
			const title = p.name || p.title || "";
			const image = p.img || p.image || "";
			const price = Number(p.price || p.current_price || 0);
			const orig = Number(p.original_price || p.list_price || price);
			const hasDisc = orig > price;
			const rate = hasDisc ? Math.round(((orig - price) / orig) * 100) : 0;

			const item = document.createElement("div");
			item.className = "furkan-product-item";
			item.setAttribute("data-id", id);
			item.innerHTML = `
				<a class="product-link" href="${encodeURI(p.url)}" target="_blank" rel="noopener">
					<div class="furkan-product-image">
						<img src="${encodeURI(image)}" alt="${escapeHtml(title)}">
						${hasDisc ? `<span class=\"furkan-discount-badge\">%${rate}</span>` : ""}
					</div>
					<div class="furkan-product-info">
						<div class="furkan-title"><strong>${escapeHtml(p.brand || "")}</strong> - ${escapeHtml(title)}</div>
						<div class="furkan-stars">★ ★ ★ ★ ★ <span style="color:#9b9b9b;font-size:12px;margin-left:6px;">(100)</span></div>
						<div class="furkan-prices">
							<span class="furkan-price${hasDisc ? '' : ' no-discount'}">${formatTL(price)}</span>
							${hasDisc ? `<span class=\"furkan-orig\">${formatTL(orig)}</span><span class=\"furkan-percent\">%${rate}</span>` : ""}
						</div>
					</div>
				</a>
				<button class="furkan-heart${favourites.has(id) ? " furkan-favorited" : ""}" aria-label="Favori"></button>
				<div class="furkan-cta"><button type="button">Sepete Ekle</button></div>
			`;
			track.appendChild(item);
		});
	}

	function wireEvents() {
		const wrapper = document.querySelector(".furkan-carousel-wrapper");
		if (!wrapper) return;
		const track = wrapper.querySelector(".furkan-product-carousel");
		const prev = wrapper.querySelector(".furkan-arrow-left");
		const next = wrapper.querySelector(".furkan-arrow-right");
		prev.addEventListener("click", function () { track.scrollBy({ left: -280, behavior: "smooth" }); });
		next.addEventListener("click", function () { track.scrollBy({ left: 280, behavior: "smooth" }); });
		wrapper.addEventListener("click", function (e) {
			const heart = e.target.closest && e.target.closest(".furkan-heart");
			if (!heart) return;
			e.preventDefault(); e.stopPropagation();
			const item = heart.closest(".furkan-product-item");
			const id = item && item.getAttribute("data-id");
			if (!id) return;
			if (heart.classList.contains("furkan-favorited")) {
				heart.classList.remove("furkan-favorited");
				favourites.delete(id);
			} else {
				heart.classList.add("furkan-favorited");
				favourites.add(id);
			}
			localStorage.setItem(LS_FAVS, JSON.stringify(Array.from(favourites)));
		});
	}

	function formatTL(value) {
		return (Math.round(Number(value) * 100) / 100).toFixed(2) + " TL";
	}

	function escapeHtml(str) {
		return String(str)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	function findStories() {
		const selectors = [
			"section[class*=stories]",
			"div[class*=stories]",
			"section[id*=stories]",
			"[data-testid*=stories]",
			"[class*=Stories]",
		];
		for (let i = 0; i < selectors.length; i++) {
			const el = document.querySelector(selectors[i]);
			if (el) return el;
		}
		return null;
	}

	function findHeroBanner() {
		const selectors = [
			"img[alt='hero-banner-background']",
			"img.banner-bg",
			".banner-bg",
			"img[alt*='hero'][alt*='background']",
			"section[class*=hero][class*=banner]",
			"div[class*=hero][class*=banner]",
			"[data-testid*=hero]",
		];
		for (let i = 0; i < selectors.length; i++) {
			const el = document.querySelector(selectors[i]);
			if (el) return el;
		}
		return null;
	}
})();

