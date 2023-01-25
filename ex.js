const $ = (e) => document.querySelector(e);
function parseTextAddress(e) {
  var t = TonWeb.boc.CellParser.loadUint(e, 2);
  if (0 == t) return "🕳️ Null address";
  if (2 != t) return "Unsupported address type 1 " + t;
  if (0 != TonWeb.boc.CellParser.loadUint(e, 1)) return "Unsupported address type 2";
  var t = TonWeb.boc.CellParser.loadInt(e, 8),
    a = new Uint8Array(32);
  for (i = 0; i < 32; i++) a[i] = TonWeb.boc.CellParser.loadUint(e, 8);
  var s = new TonWeb.utils.Address("0:0000000000000000000000000000000000000000000000000000000000000000");
  return (s.wc = t), (s.hashPart = a), s.toString(!0, !0, !0, !1);
}
function setAccountAddress(e) {
  $("#accountAddress").innerText = e;
}
function resetTimeline() {
  $("#uploadFilesTimeline").classList.remove("timeline__item--active"),
    $("#uploadFilesTimeline").classList.remove("timeline__item--current"),
    $("#sendRequestTimeline").classList.remove("timeline__item--active"),
    $("#sendRequestTimeline").classList.remove("timeline__item--current"),
    $("#registerTimeline").classList.remove("timeline__item--active"),
    $("#registerTimeline").classList.remove("timeline__item--current"),
    $("#waitingConfTimeline").classList.remove("timeline__item--active"),
    $("#waitingConfTimeline").classList.remove("timeline__item--current"),
    $("#lastTimeline").classList.remove("timeline__item--active"),
    $("#lastTimeline").classList.remove("timeline__item--current");
}
($("#topupModalButton").onclick = function () {
  showTopupModal();
}),
  (window.onclick = function (e) {
    e.target == $("#topupModal") && closeTopupModal();
  });
const showTopupModal = function () {
    $("#topupModal").style.display = "block";
  },
  closeTopupModal = function () {
    $("#topupModal").style.display = "none";
  };
function page(e, t) {
  var a = document.getElementsByClassName("page");
  for (let e = 0; e < a.length; e++) a[e].style.display = "none";
  var s = document.getElementsByClassName("menu__link");
  for (let e = 0; e < s.length; e++) s[e].className = s[e].className.replace(" menu__link--active", "");
  (document.getElementById(t).style.display = "block"), (e.currentTarget.className += " menu__link--active");
}
const filesInput = document.getElementById("filesInput"),
  clearFiles =
    (filesInput.addEventListener("change", (e) => {
      var t = document.getElementById("files");
      clearFiles();
      let a = "";
      for (let e = 0; e < filesInput.files.length; e += 1) {
        var s = filesInput.files[e];
        (a += `
<div class="file">
    <div class="file__name">${s.name}</div>
    <div class="file__size">${(s.size / 1e6).toFixed(2)} mb</div>
</div>`),
          (t.innerHTML = a);
      }
      console.log(filesInput.files);
    }),
      function () {
        document.getElementById("files").innerHTML = "";
      });
async function errorMessage(e) {
  ($("#error .error__text").innerText = "Error: " + e), ($("#error").style.display = "flex"), await new Promise((e) => setTimeout(e, 3500)), ($("#error .error__text").innerText = ""), ($("#error").style.display = "none");
}
async function readProviderData() {
  try {
    var e,
      t,
      a,
      s = await fetch("https://tonstarter.org/api/getProviderInfo"),
      i = await s.json();
    console.log("provider info:"),
      console.log(i),
      s.ok
        ? ((e = new TonWeb.utils.Address(i.result.address).toString(!0, !0, !1)),
          (a = await (t = await fetch("https://tonstarter.org/api/getProviderParams")).json()),
          console.log("provider params:"),
          console.log(a),
          t.ok
            ? (($("#providerAddress").innerHTML = `<a href="https://ton.cx/address/${e}" target="_blank" class="link">${e}</a>`),
              ($("#providerStatus").innerHTML = Number(a.result.accept_new_contracts) ? '<div class="status-true">True</div>' : '<div class="status-false">False</div>'),
              ($("#providerRateSvg").style.display = "flex"),
              ($("#providerRate").innerText = Number(a.result.rate_per_mb_day) / 1e9),
              ($("#providerMaxSpan").innerText = Number(a.result.max_span) + " sec"),
              ($("#providerMinFileSize").innerText = Number(a.result.minimal_file_size) + " bytes"),
              ($("#providerMaxFileSize").innerText = Number(a.result.maximal_file_size) + " bytes"))
            : await errorMessage(a.message))
        : await errorMessage(i.message);
  } catch (e) {
    await errorMessage("Can't get the provider data");
  }
}
$("#readProviderDataButton").addEventListener("click", readProviderData), readProviderData();
const tonweb = new TonWeb(new TonWeb.HttpProvider("https://toncenter.com/api/v2/jsonRPC")),
  OP_NEW_STORAGE_CONTRACT = 276580847,
  OP_TOPUP_BALANCE = 213570953,
  OP_CLOSE_CONTRACT = 2046375914,
  OP_CONTRACT_REGISTERED = 3212562625,
  TOPUP_REGEXP = /^[0-9]+\.?[0-9]*$/i,
  BAGID_REGEXP = /^[A-F0-9]{64}$/i,
  ADDRESS_REGEXP = /^[-1|0]:[A-F0-9]{64}$/i,
  NON_BOUNCEABLE_ADDRESS_REGEXP = /^[A-Z0-9/+]{48}$/i,
  BOUNCEABLE_ADDRESS_REGEXP = /^[A-Z0-9_-]{48}$/i,
  onTonReady = async () => {
    if ((console.log("tonready"), !window.tonProtocolVersion || window.tonProtocolVersion < 1)) alert("Please, update your TON Wallet Extension");
    else {
      const d = window.ton;
      console.log("isTonWallet=", d.isTonWallet),
        d.on("accountsChanged", function (e) {
          setAccountAddress(e[0]);
        });
      var e;
      (e = (await d.send("ton_requestAccounts"))[0]),
        console.log(e),
        setAccountAddress(e),
        await !console.log(await d.send("ton_requestWallets")),
        $("#createContractButton").addEventListener("click", async () => {
          try {
            $("#uploadFilesTimeline").classList.add("timeline__item--active"), $("#uploadFilesTimeline").classList.add("timeline__item--current");
            var t = document.getElementById("filesInput").files;
            if (0 < t.length) {
              var a = new FormData();
              for (let e = 0; e < t.length; e += 1) console.log(t[e]), a.append("torrentFiles", t[e]);
              var e = await fetch("https://tonstarter.org/api/upload", { method: "POST", body: a }),
                s = await e.json();
              if ((console.log("upload:"), console.log(s), !e.ok)) return resetTimeline(), void (await errorMessage(s.message));
              $("#bagidInput").value = s.result.hash;
            }
            var i,
              n,
              r,
              o,
              l = $("#providerAddress").innerText,
              c = $("#bagidInput").value;
            BAGID_REGEXP.test(c)
              ? ($("#uploadFilesTimeline").classList.remove("timeline__item--current"),
                $("#sendRequestTimeline").classList.add("timeline__item--active"),
                $("#sendRequestTimeline").classList.add("timeline__item--current"),
                (i = (new Date().getTime() / 1e3).toFixed(0)),
                (r = await (n = await fetch("https://tonstarter.org/api/newContractMessage", {
                  method: "POST",
                  headers: { Accept: "application/json", "Content-Type": "application/json" },
                  body: JSON.stringify({ provider: new tonweb.utils.Address(l).toString(!1, !1, !1), torrent: c, queryId: i }),
                })).json()),
                console.log("contract message:"),
                console.log(r),
                n.ok
                  ? ((o = $("#initInput").value),
                    TOPUP_REGEXP.test(o)
                      ? (d.send("ton_sendTransaction", [{ to: l, value: 1e9 * $("#initInput").value + 58067e3, data: r.result.payload, dataType: "boc" }]),
                        $("#sendRequestTimeline").classList.remove("timeline__item--current"),
                        $("#registerTimeline").classList.add("timeline__item--active"),
                        $("#registerTimeline").classList.add("timeline__item--current"),
                        (async function (e) {
                          let t = $("#accountAddress").innerText,
                            a = !1;
                          await new Promise((e) => setTimeout(e, 1100));
                          for (; !a; ) {
                            var s = await tonweb.provider.getTransactions(t);
                            if (s.length) {
                              try {
                                var i = tonweb.boc.Cell.fromBoc(tonweb.utils.base64ToBytes(s[0].in_msg.msg_data.body))[0],
                                  n = i.bits.readUint(32).toNumber(),
                                  r = i.bits.readUint(64).toNumber();
                                n == OP_CONTRACT_REGISTERED &&
                                e == r &&
                                (($(".msg").style.display = "flex"),
                                  ($("#newContractAddress").innerHTML = `<a href="https://ton.cx/address/${s[0].in_msg.source}" target="_blank" class="link">${s[0].in_msg.source}</a>`),
                                  (a = !0));
                              } catch (e) {
                                console.log(e.message);
                              }
                              await new Promise((e) => setTimeout(e, 1100));
                            }
                          }
                          $("#registerTimeline").classList.remove("timeline__item--current"),
                            $("#waitingConfTimeline").classList.add("timeline__item--active"),
                            $("#waitingConfTimeline").classList.add("timeline__item--current"),
                            (async function () {
                              let e = $("#newContractAddress a").innerText,
                                t = !1;
                              await new Promise((e) => setTimeout(e, 1100));
                              for (; !t; )
                                -1 == (await tonweb.provider.call2(e, "get_storage_contract_data", []))[0].toNumber() &&
                                ((t = !0), $("#waitingConfTimeline").classList.remove("timeline__item--current"), $("#lastTimeline").classList.add("timeline__item--active")),
                                  await new Promise((e) => setTimeout(e, 1100));
                            })();
                        })(i))
                      : (resetTimeline(), await errorMessage("Please, enter the valid initial balance")))
                  : (resetTimeline(), await errorMessage(r.message)))
              : (resetTimeline(), await errorMessage("Please, enter the valid BAG ID"));
          } catch (e) {
            resetTimeline(), await errorMessage("Can't create the contract"), console.log(e.message);
          }
        }),
        $("#readContractData").addEventListener("click", async function () {
          var e = $("#contractAddress").value;
          if (ADDRESS_REGEXP.test(e) || NON_BOUNCEABLE_ADDRESS_REGEXP.test(e) || BOUNCEABLE_ADDRESS_REGEXP.test(e))
            try {
              var t = await tonweb.provider.call2(e, "get_storage_contract_data", []),
                a =
                  (($("#contractStatus").innerHTML = t[0].toNumber() ? '<div class="status-true">True</div>' : '<div class="status-false">False</div>'),
                    ($("#contractBalance").innerText = t[1] / 1e9),
                    parseTextAddress(t[2])),
                s =
                  (console.log("provider: " + a),
                    ($("#contractProvider").innerHTML = `<a href="https://ton.cx/address/${a}" target="_blank" class="link">${a}</a>`),
                    ($("#contractFileSize").innerText = t[4]),
                    ($("#contractRate").innerText = t[6] / 1e9),
                    parseTextAddress(t[9]));
              console.log("owner: " + s),
                ($("#contractOwner").innerHTML = `<a href="https://ton.cx/address/${s}" target="_blank" class="link">${s}</a>`),
                ($("#contractData").style.display = "flex"),
              s === $("#accountAddress").innerText && ($(".block__aside").style.display = "flex");
            } catch (e) {
              console.log(e.message), await errorMessage("Can't get the storage contract info"), ($("#contractData").style.display = "none");
            }
          else await errorMessage("Please, enter the valid storage contract address");
        }),
        $("#topupButton").addEventListener("click", async () => {
          var e = $("#contractAddress").value;
          if (ADDRESS_REGEXP.test(e) || NON_BOUNCEABLE_ADDRESS_REGEXP.test(e) || BOUNCEABLE_ADDRESS_REGEXP.test(e)) {
            var t = $("#topupInput").value;
            if ((console.log(t), TOPUP_REGEXP.test(t))) {
              try {
                var a = new tonweb.boc.Cell(),
                  s = (a.bits.writeUint(OP_TOPUP_BALANCE, 32), (new Date().getTime() / 1e3).toFixed(0));
                a.bits.writeUint(s, 64), d.send("ton_sendTransaction", [{ to: e, value: 1e9 * t, data: tonweb.utils.bytesToBase64(await a.toBoc()), dataType: "boc" }]);
              } catch (e) {
                console.log(e), await errorMessage("Can't topup the contract");
              }
              closeTopupModal();
            } else await errorMessage("Please, enter the valid topup balance");
          } else await errorMessage("Please, enter the valid storage contract address");
        }),
        $("#cancelButton").addEventListener("click", async () => {
          var e = $("#contractAddress").value;
          if (ADDRESS_REGEXP.test(e) || NON_BOUNCEABLE_ADDRESS_REGEXP.test(e) || BOUNCEABLE_ADDRESS_REGEXP.test(e)) {
            console.log(e);
            try {
              var t = new tonweb.boc.Cell(),
                a = (t.bits.writeUint(OP_CLOSE_CONTRACT, 32), (new Date().getTime() / 1e3).toFixed(0));
              t.bits.writeUint(a, 64), d.send("ton_sendTransaction", [{ to: e, value: "30000000", data: tonweb.utils.bytesToBase64(await t.toBoc()), dataType: "boc" }]);
            } catch (e) {
              console.log(e.message), await errorMessage("Can't cancel the contract");
            }
          } else await errorMessage("Please, enter the valid storage contract address");
        });
    }
  };
window.ton ? onTonReady() : window.addEventListener("tonready", () => onTonReady(), !1);