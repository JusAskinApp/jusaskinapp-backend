const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();
const db = admin.firestore();

router.use(express.json()); // for application/json
router.use(express.urlencoded());

var professionalDetailsObject = {
  ID: "",
  Name: "",
  DoB: "",
  Rating: "",
  Description: "",
  Qualifications: "",
  Experience: "",
  AnswersIDs: [],
  ResourcesIDs: [],
  SchedulingIDs: [],
  Pricing: "",
  ProfilePicture:
    "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",
};

const studentDetailsObject = {
  ID: "",
  Name: "",
  DoB: "",
  AreasOfInterest: [],
  GroupsIDs: [],
  ResourcesIDs: [],
  ConnectionsIDs: [],
  Points: 0,
  BadgesIDs: [],
  CoursesIDs: [],
  BlogPostIDs: [],
  PodcastIDs: [],
  ProfilePicture:
    "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAEZ0FNQQAAsY58+1GTAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAIABJREFUeNrtnQl0VFWexv/31ZINsrIEgkAEZBeksdUWRVYRRsYOdFBIcJhum3EgsU9sQjjd0xbTPYdNOWOiYzP2NErAI+kGexxpZFHARmwBEWQRZElAwhLIwpJUUql6d+59VUCAAEmo5b16389Tvqqw1fvu/b73v++9ex8jYGgcS5dGRtVYUrmqdGWM2okfdSROMZxRCuMsnhGP50SdiJH16h/iFCf+n3DDX1Upfs+FBr/HzYhOcmJVnPEqxqlU/Hq1+JVTnFMZU9QSZ7Sn2DFtWi1awbgwSGAAkzscSkzCvX24YumtMhrIOE8VP+4qXnKbHOKvd0a8isWrhDNWrHDazVTPt9WVxw6I762i9RAAoJlH9MiaiMHEPT8krgxgpPYXP+4jmirCWHvC68T/DnBS9hJT9xCzbK+NrtuJigEBABrw6pL32nhcniHE2BBRdv9IGGeQ8czenFBgu0Sv20acb7XYLVt/OX3yefQCBICJyvkie1RC/aPiqPikMP048aN+JpdknwiDNaLaWeestH3ucKS70EsQAGHF4rfeTXF7rONI5WM5oxHiR62gSqNcZpw+IYX91Wpxr8l58flSSIIAMCQL31yarHLbBNGh08XHx6B188cL4vU3EZhFCqtflTtj2hlIggDQ95F+cVGi214/kRN/VnTfoeJHClTxC6roqVsYsfetLtufc3LSKyAJAkA3zCsofMJC7AVxyEoTHyOhSECpFZ12tYf423OyMjdDDgRASPiP/3yvvcWiPi8E/Jn42AOKhITDInT/4PEo7/7qF5PPQg4EQMCZn184QJSiLwvlJomPdiiiC1xiyLVSDL1ey8vO3AM5EAB+Z+GbhWO4quQQ8VFQQ9ddegNT1MW5MzI/hhYIgLuiqKjIUlxWP5k4nyU+9ocihmIvMbYotZ3tvfT0dA/kQAA0GXnvfXRit0lcYa+I0rInFDF0Dz/EVD63puLoSsxNQADcudQvKJzAic0Vb/tCjbBiPyP+Sm5W5ipIgQC4iUX5K0aqjC8SbwdCjbBmt8LZrFnZUzZCCgQAzXuzsLuistfE2/HoDqbiQ1XhL8+ZkXkEAWBC5i8pilNcdb8W5X424XKeWXGJYUG+ao/4Xd709AsIAJOwoKBwmtj1+eJtO3gACMqIeN7srMylCIAwZmH++9244n6bOA1DnweNuGETU60v5GY/exQBEEY4HJuskUmlOWJnHeJjFHo6uA1OLvpJbXnKYodjmBsBYPSj/huFgzhnb4u3g9C3QTPYxRh/IXdm5i4EgCGP+g4lqk332aLcl9f0bejPoAXUC4e84jx/ZEG43kQUlgEw//VlnZnClondG4o+DO4evoWrfGreS1NPIAD0XvIXLJ8kxnC/F2/j0XGBH6kSZvmX3KyMlQgAHbJ4cVGUy+76L8bpn9BXQcBqAUbv2F32f83JSXeGw/5YwmEn5v3Xins586wXaTYGXRQE+Ig5ULV4xo14esKGT9asrkQAhHq8X7D8KYXTOvI+JQeAYJAsKs2pI8emfbNx7eojCIBQlGKcs5i2PX4j3v63eEWjT4IgEyWqgedGj0uj9WtWfTZ37lycAwgWjiVLoqNcrVaIGHgG/RDowEZ/cdovT3FMn16DCiDAyMU4I1XbevI+YAMAPdDL7raPfuLJiR9++vGqagRAgHg1f3kfZuGbCIt1AP3V0imKhU8cMyZtw/q1q89hCOBn5hUsG66QIldzwfX9JhIf14raJMZRQnwsJcS1pkSxjYmJJKvFShaLQq1ivNMiLlc7yeNRye1xU3V1LVVUXaTKC5eoUmzPV1ygqguXIWbTqVJJnTAna+qnCAA/4bu5Zxlh3v5tiYuNoc6dkqlLSrLYtr9q8LtFBsSJk2fpeOkZsT1DFy5WQ+zb4xLGmmqEm4Z0HwAL85f/M2famX4L+tXNREVGUK8eXahfr1Tq0L5NUP7N02fP076DxXTw8HFy1tahERrHwzj9PDc7448IgJYf+bPEkf91wtJlNyHN/tCgPtSta4pWzoekh4thw9GSUvpy1wEtFMBNiGMXvSQqgQIEQDOZX7A8T3y5eehD19M5pT09MrgfdbknWVff6/j3Z+iLnfvoRCme0HVTChDNycvKmI8AaKr585fPZYx+g65zjaSEOBo19EFtbK9n5LmCDVt2UHnlBTRawxDg9O952Rmv6O176W5crR35Gf0WXcaLzWalxx4eQONGPULxca11/33jYlvRwH7dxfe20akz50lV8SwO7UjLaOjIsWl1G9eu3ooAuAUL8gtnMqYt0Q0E93RsR5OeGaGN84UuBursjDp1aEt9e6bS2XMVdPESrhr4yu2Ro576cfnGtR9sRwDcgDzbL3rOW4QTfpqB5Dj/qRGPUGSkca98RkTYRQjcK+dtUOnpc0gAb+M+NfqptO83rF39NQLgivnldX5G74i3itn7h7ys9+Oxj9OAvt0NddS/XZh16ZRMKclt6NjxU+R2m/45nUz89w+jx6YdEiGw3/QBIO/wE4rIO/xMv25fbOsYeu7HI6lDcpuw2zd5/qJHaic6UlJKda56sze1PNCNHzH2mW2frP2g2LQBIO/tF4cIOZc/xuw9ok1SvDD/KO0kWthWN1Hem5aKvz9NNc5asze5RRz4/nHMU2n/F8q5AyELADmrzzexJ9nsPaFD+yR69pmRFB0VGfb7arfbqPd9XbX7BeQtxiYnkis0btjoie+HahZhSAJAzueP4PYN4m0fs/eApIRYmiTML8f+ZsFqtdB93e6ho8UncSuxGB0pCj0x5JknV2z+6KOgj42CftJNruTjW8xjsNlbvlVMNP1k/HBTmf/qcEDss9x3qQHgg6UnpDfCvgLwLeP1otmbXJbC8oSfnKprVuRlwtTOHWj/dyXavAKT02vbjr3qhr+u3hK2ASAX8CTvGn6mv9Y/dsQjurufPxRER0dSXOsY+u7o9ygESLtbcEcwFxoNWgDIpbt9q/eavuaT1/gfHtwP3d1H26R47YSgvGvQ5Mg7P8aOeHrCn4K15HhQzgHIh3YoHr5avE1AZ4+nEY8NhutvQGoitQGUIL0iPRM2ASCf2CMPfIh3RmOGP6ydBQfXIzWR2oTD3Y/+KBJ9njH+EEDe5is2v0ObEg3s10N7gcZp3SqaqmucdKbM9EMB7QlEo8emHQz07cIBrQDkU3p9D+o0PdFREfT4wwMhxB2QGkmtgLaQyO+lhwwZAA6HQ/E+ohur+EqGPDTA0DP7goXUSGoFNOKlh6SXDBcAUW26zxaFzFC0ofeGn/69u0GIJiK1wg1CVwcDQ71eMlAALHyjcJCoX+ai8bz8cFDvkC3caUSkVlIzcHUsMFfzlBECwOHYZOWcvU2Y3nt17C+v+4PmITXDuYCr2KSnpLd0HwCRSaU5YjMIbebl/j7dyWa1Qojm9nihmdQOXGWQz1v6DYB5bxZ2Z6IIQFtdo2+vVIgA7fxzNkB4S3pMlwEgZzJZVGWJeBuFpvLSoV2Stpw3aBlSO6khuEqU9Jg/Zw367Uag6Dbdp4nNL9BG13j4B32D9riucMXj8WhrCYKrpH6+/ZvjG9d+sFs3FUB+/vJYUaDMR9tcT/fUThABGgZiMDDf6zmdBEAt4/8mNu3QMNeQj+aWi3yCu0NqKLUE19HO57nQB8DC11f04MSy0SbXI5fCBtAyUEjPSe+FPAC4wl8VG9zjegPyIZ7AT1oiABrD7vNe6AJgwRuFo8RmPNriZnDyz59a4krALRjv82DwA0C7FMFpAdrgZuStrHGxGP/7C7lkGG6lvuVYYMHdXBZssaqL3lieRsQeQAvcTEJcayxs4UeklgkGeDJyiNR5wOvFIAaAnJ7IiTkgfuMkJsRCBGgaxCKAOVo6ZbhFfyg6sZtc5QerWt6qZI3FZStoGlT6+TwZ+AAoKiqycIW9As1vTYQdEyGhaZCrAOFJ6c2AB0BxWf1kUXP0hOS3xm5DZ4WmQR8H9NS8GfAhAOezoPYdOqsd03+haShCoPnebFYAzC9Y8aTY9IfStwfz/6FpiOjv82hgAoARvQyN7wyecwdNQ0VzPdrkAJifXzhA1BgjIfGdcdXXQwRoGqpxwEivV/0cAIzYy4SHejats7rQWaFp6IoAn1f9FwCL3lrWTlh/ErRt6tHKDRGgaSjHAZM0z/orADxu5Z8IM/6ajHzSLYCmIcTu8+zdB4CcaCBKip9C06ZTUXURIkDTEBcB7KdNmSR0xwCY/8byoSIG7oOkzeisleis0DTU8Pu83r3LAFAY/QxiNo/aOhfVOGshhJ+ocdZpmoLm0RTv3jYAFi8uSiTOJkDK5nOuvAoi+E3LSojQoiKATdA83NIAcFnrfiI2kVCy+Zw4eRYiQMtQE+nzcMsCgCkMl/5ayPGTZyACtAw5d/LwLQNg4ZtLk4nT45CwZZwpK8fNK35Aaii1BC0dBtDjmpebGwAqt8mxvwUKtgxV5Thy+enoL7UELcbi83LzAoBxSod2d8eB70ogAjQM/TDgNl5uNAAWv/VuitgMgXR3x5Hik7h8dRdI7aSG4K4Z4vN00wLAVa/8A/n50eFmRE5hPXj4OIRoIVI7TAP2C4rP000LAIXYU9DMP3xz4AhEgHahT4BbePqmAHA4iuxcoeGQzD+cKaug4hOnIUQzkZpJ7YB/kJ6W3r5jAEQl1D9KnPAUBj/yxc59EAGahTgBqLXm7TsOASwc5b+fOXmqjL4XL9B0vU5CL//TiLeVRpJiDJTyP1u2fS2nVkOIOx2ohEabhVYgIFXAmNsGgG8VETzxJwCcOnOe9n57FELcAamR1AoEhH43rhR0XQCobvYjwrp/AawCdpOztg5C3AKpjdQIBAzm83jjASCc/yg0CmwH3/T5LghxC6Q2CMgAJ8ANHr8uADi7Ph2A/9n37THc3toIUhOpDQjwaQB2iwrAsXRpJHH+A0gUeNZv+hJr3DVAarF+83YIEZQE4D/QvH5jAETWRAwWBUIEFAo8conrDz/eSm63x/RaSA2kFpg6HbRBQITX6zcEAPOoD0Gc4FF2vpI+XLfV1FNd5b5LDaQWIIgR0MDrSoOxwf2QJrjImW7rNn9p2v2X+47ZfiE5D3D/zRUAqXjqbwjYe+AoffaF+S59yX2W+w5CUAE08LoWAA7HJvns5T6QJjT8/av99OnWr0xxp6DcR7mvcp9ByOjj87w3AFollt6HE4ChZefug7Rm4zYxLg7f+e9y3+Q+yn0FIa0BIrye9wWAW8H4Xw8cOFRCqz7aTHVhuIqQ3Ce5b3IfQei54nktABjnuP9fJ8h58O+sXEunw2glXLkvcp+wLoKOagCf56+cBLwXkuiHCxcv04o/r6ev9hi/VJb7IPdF7hPQFZrnrb4PXaGH/sbLn/ztKzpSXEqjhj5IiQmxhvr+8mGeG7bswNLo+qVrwwBIhR76RBpo6ftr6MEH+tAjg/uSzWrV9fetd7vpi537acfXB7Cgp77RPM8WLy6Kqre5qgnTgHVPbOsYemhQH7q/T3eyWPS1aLM0u1zE88tdB+jipWo0lv7htnp7jLU+orYrqQrMbwCksWRZvW3HPvrhoN40sG8PstlCWxHU17tp9/7DtH3Xt1Rd40QjGQcmvW/lqtIV7jcW0mibtu6iz7fvpZ7dO1PfnqnUOaV9UL/DidKztP9QMR06cgITeYxaAgjvWxVOHTgSwJBI48nbaeVLDg969ehCXTolU6cObf1eGcgj/cnT57RzEvKBHSjzjY/0vpUTT8LwPzyGB9vF+Fu+FEWhju2TKEUEQZukeEqMjxWv1hQRYW/S3yVv2qmouqTN0z9fXkWlwvinzpaH9V2KpqwAhPflYSIJUoQX0qjyaC1fDYmOihSVgYVax0RrIXGlSpBHd/lnLlXXiPceqnHWQkRzIAKAURvoYA40YzvljUYo3wHJwr+NIkYCqAAAMOdZgCSFuIoKAABTngRQRQXAWAKUAMCMQwCWIG8nwzoAAJiTCAQAACYPADt0AMCU2FEBAIAKAACACgAAYKoKwAoNWo68x75zp/bUsX0bbcWemOgoahUTpbu5+uGCXHPgcrWTapxOKq+4SKfOntdmJcrVh0DLkAEgn8ccDSmaRlRkBA3o212bgpuUGAdBgogM1rjYGO3VQYRuv97epSzLKy/Q/oPF2oIkNU48XrwZ1MkAcCEA7kxkhJ0eebCfLhbhANeTlBBHjz8yUGufPfuP0LYde6m21gVh7ozrSgUAboM82g9/7Afa0R/oF7le4uABvbT2kgum7Dt4DKI0sQIAjWAXR/rRTzxEfXp2hRgGG6aNHfkIpXbuQOs2b8eKRagAmo+cOz/x6WGU3C4RYhiU3vd11U7O/vn/NlF1DdY4aKwCUBAAjZt/8oRRMH8Y0L5tIk1OG00x0ZEQo9EA4LwSOlxf9v9k/DDtEh8IDxLiW4tqbjjZ7TaI0RDhfYWYch5KXOPJYQ9pRw0QbpVAgta2oAHC+2IIoJZDCS/9e3fTxo0gTM8J9OiitTG4glouhgCECoC8Z46fePQBCBHmyDbG5dwrQwCSFQChAhD86MH+6BgmCXrZ1kCjXGHETB8A8gyxvL0XmIP7+3bTrvSY/hSA8L6iMjqNDtGdrFYLnGES5B2DCHwi6X2FKWqJ2YWQt44CtLnpKgDhfcVWF1minQ4wKXJGH675mw95h6CcRGRiuPS+kpOTLp/pfNasKsiHaQJzItdyMDFnpfevrFxRbFYVOrTHg5HQ9qZE8/yVADDteQCU/yYeBpi77UsaBoBpJ07HtsZaKOZt+xgz7/6xqwHAGdtnVhXsNkwQMW3bm3hy0BXPawFgVfk3ZhUCy3uZOABM3PZXPK8FwOWKlO9EJmBdAADMcfyv83reFwAOxzC32ByAMACYggM+z189CUiclL3QBQATHP8beP1qADBu3vMAAJiJhl6/VgFYlC8hDQAmqAAaeP1qANRG1+3EiUAAwt7+dV6v3xAAjmnTaomxryAQAOFc/7OvNK/fGAC+scE2KARAWI//r/P4dQHAiT6HRACE8QDgBo9fFwCKVUsHDpkACE//+zzeeADMenFqmdjsg04AhCX7fB5vPAC8gwT6GDoBEI4nAG729s0B4GFroRQAYUgj3r4pAJyVts9FUlyCWgCE1dH/kubtOwWAw5HuYip9CsUACCP/C09Lb995CCBQiWMYAEAYcStPNxoAdpv6kfZnAABh4X+fp5sWADkvPl8qNluhGwBhwVafp5sWABLOqAi6AWB8buflWwaAwupXiY0H8gFgaDw+LzcvAHJnTDtDjD6DfgAYGOFhzcvNDQCtdFD5SigIgIHL/zt4+LYBYHdH/ElsaiEjAIak1ufhlgVATk56BTG+CjoCYMTyn6/SPNzSAJConP4AJQEwHk3x7h0DIG9mxhYRJd9BTgAMdfj/zuvduwwAxhjnxP8HggJgHKRnpXfvOgAkFqv6jti4ICsAhsDl8yz5JQC0VUQ44ZIgAMY4/K+8ceWfuwoAX0nxGmG9QAB0b3+fV8mvAZCXnbmHiG2EvgDoGbbR61U/B4C3CqDXIDAAeq7+m+fRZgVAXtaUdWKDpwgDoE/2+jwamADwVhhsEXQGQI/Vf/O92ewASG1ne48YHYLaAOjJ/HRI82agAyA9Pd3DVD4XigOgI/8LT0pvBjwAJDUVR+U9AXiCEAD6YJ/PkxSUAHA4HCoj7oDuAOih+ucO6cmgBYBk1syM1UT8a8gPQCjhX3u92DJaHADaRANGs9EAAIT08D+7KZN+/B4AktkzMzeIzYdoBQBCwoc+D1JIAkALIJX9kjBTEIBg4/J5j0IaALkvTTnMiOejPQAIZuXP86X3Qh4AkkjOfis2ZWgWAIJCmc9zpIsAyM7OuEjE89AuAAQDnuf1nE4CQBsKzMx4hxHDY8UBCGjpzz6VXvPX3+e3AJCXIjyKOl28daKZAAgITumxu7nsF7AAkMyZkXlEfDOHkRStcdahW5kUo7W99Jb0mD//TsXfX7K2PGWx2OwyiqiXLlfDCSbFYG2/y+ct0nUAOBzD3KJCeUG8rTdGJ6iBE0wbAIZp+3rpKekt3QeAJHdm5i5i9IoRlD11thxOMCmGaXvhJc1TAUAJ1Hd2nj+yQIxatuhd24PflcAJJsUYbc+3eL0UGAIWAHJ6Ilf5VPG2Ss/yVl28TKfPnocbTIZsc9n2OqdKeqilU31DGgCSvJemnmBE/6J3lXfuPghHmAwjtLn0jvRQIP8NJdA7kZuVsZIzekfPQn97+DidOHkWrjAJsq1lm+u68Beekd4J9L+jBGNn7C77v4rNHj0LvuGzHaSqKtwR5sg2lm2tc/b4PBNwLMH4R9at+5N7xNMT1jNO8pxAlB4VdzrrtBtDunVNgUvCmA1bdlDx8VN6/oqVqoWNyM1+7lzYBIDkkzWrK0eOTftGjGue8w5v9MeZsgqyWCzUqWM7OCUM+ftX++nLXQd0XaBwoolzZmYErUSxBHPvNq5dfWT0uDT5dpheW+D4yTMUH9uK2rVJgGPCiP0Hj9HGz3bq+jsyRo7ZWRn/E8x/Uwn2Ts6aMeW3Ylf/oueGWLPxC/piJ1Y9DxdkW8o21TfsL15vBPlfDcWuOpYsiY5ytdpCxAfruUn69kylMcMfFsMCBS4yIB6PSh9/+nfaf6hY7+bf6bRfHuqYPj3o9yZbQrG7mz/6qH7YkxM/VCx8ovgYr9dmOVdeRcUnTlHH5LYUEx0JRxkI2Xar12wW7Xda596nErdHGf6bmdNCcsOcJVT7/enHq6rHjEnbwBlNER91667L1U765sBR4pxTiggCRWFwl86P+l/s3EsfbdhmhMk+VRZOI/JemlISqi9gCeXer1+7+tyIsc/sYMSeC/V3uR3S/N+XltHhY99TXGwrSohvDafpkGPHT9H/rv2MDh05obWZznGppI6fnZ25PbQFiA5YWLB8kmiuFXoOgYZ06tCWHnt4IN2TgsuFekCG89/+vptOnj5nlK/sEcabEow7/QwRAFoI5C//ZzEc+APp9B6Bxuh6TwcaPLAX3dulI1wYoiO+vKe/5PvTRvranHH6WW52xh/1cQpCRyzIL5xJjBUYrSMmxLWmB/rfR/1630uREXY4M4DU1rlo37fH6Ou931HlhUvG2wHOs0TZ/4Zevo7ujrbzC5bniS81z4id02q1UM9unaln9y6U2rkDLh/6q172qNrZ/ENHjtOhoyfI7fYYcj/EMHdOXlbGfD19J12W2/Pzl89ljH5j5E4bISqBHvd2ot49umrnCqwWC5zcDNwejza2//ZwCR0+dpLq6oz99DnO6d/zsjN0t0qWbsfbRq4EbsRmtWrzC1K7dNAqg6SEODi8EcorL2hH+uLjp+nkqTKqd7vDYr/0eOTXfQBIFhYszxLivU4GOjHYFFq3iqaUDm0pJbkNdRTbdkkJphsuyLK+rLySTp0+R6VnzlOp2IbhAq1cdNyXcrMydHteS/fG8l0d+G8yyCXCFp07EMOD9u0SqX3bREpKjKPktglalWC328Ji/1yueu3ofuZcJZVXXKCz5yrobFmFVuaHc8YxTj/Xy9l+wwaArxKQ9wksE29NdYo9tnUMtU2K124+iouN0WYpyvdyq7dwkCaXa+xdEC/vtlp7L2/JvXjJdM9ecAljTdXDdf6wCADJvIJlwxVSVpGO5w4EE3m5MSoqglrHRFNMTBRFRUZorzgRGhL5MzmsiBBBERkRce18hM1K0VERjf6dckGU+vpr4+7aujqqE8aW5Xp1tfeJbxeEmZ21ddpL/uxSdY22mEqtwU/S+ZEqldQJc7KmGuI5mYYaW7+av7yPR6E1xKkr+hnQoZtKLCqN+2V2xgGjfGVDjavl3IFhoye+b2F8qBAba3cB/Xif0w63RwnpxJ6wDwCJnEX46DNPrrB5IvqKj73Q9YAO7P8XZ0T1+FBN6b0bDHntSS6ckDtzchrzPn4MS/mCUKEy7bFdk9NCsZiH6c4BNMb8guVPMe9MQiziB4JJJSeakpeVsdbIO2H4a+tyodERT0/4kxiDDRUfk9EvQRDYrVrYyGCu3osAuA1yyfGxo55d5rF6UkQ1MBD9EwQK+cQee709LVjr9mMI0Ex8Nw39nnC/APAvVfJZfUa4ucfUAaCdF3h9WWemsGVi94ai3wI/HPe3yKf0BvpBnRgC+Ou8wMcfXBjy0IBltpjEOvHxcQrjeQQgoNSLQ+S/OcuP/vzXeS9VheMOhv0StwvfKBzEOXtbvB2E/gyawS7G+Au5MzN3hfNOhv2RccNfPzg95KGsP1qjL1WLtBsifmRD3wa3wcmJfl1bnvLTX+X+Y2m476ypFrlfmP9+N6643yau32cTgpC6YRNTrS/kZj971Dy7bEIWFBROE7suV2jBut5AUkbE82ZnZS41X+aZlPlLiuIUV92vObFsMtk6A+AqLkY8X7VH/C5vevoFcxY9Jmfem4XdFZW9Jt6Ohx9MxYeqwl+eMyPziLlHPUBjUf6KkSrjiwh3EoY7uxXOZs3KnrIRUiAAbmJhQeEEMSyYK972hRphxX5R7r+Sm5W5ClIgAG6Lw+FQohO7TeIKe4U49YQihu7hh5jK59ZUHF0p2hVTxxEATaeoqMhSXFY/mTifJT72hyKGYi8xtii1ne299PR0D+RAANzd0ODNwjFcVXKI+CiooesuvYEp6uLcGZkfQwsEgN+Zn184gBF7WSg3iXD5UC+4xFBtJSf+Wl525h7IgQAIOP/xn++1t1jU54WAPxMfe0CRkHCYE/3B41He/dUvJp+FHAiAkDCvoPAJC7EXRGdMEx8joUhAqRWddrWH+NtzsjI3Qw4EgG5YvLgo0W2vnyhK0WfJu0QZng/uH1TRU7eIodf7Vpftzzk56RWQBAGgaxa+uTRZ5bYJjFO6+PgYtG42oqCiv3FGRQqrX5U7Y9oZSIIAMGZl8Na7KW6PdRypfKzo0CPEj1pBlUa5LALzE1LYX60W95qcF58vhSQIgLDC4SjG4HziAAABF0lEQVSyRyXUP0pMfZIYGyd+1M/kkuwjztcQV9Y5K22fOxzpeMggAsA8vLrkvTYel2eICIMhouj9kah8B4lmiQjTqr5O7Nsu0eu2CdNvtdgtW385ffJ59AIEALhSISxdGhlZEzGYuOeH4qg4gJEq70DsY7xQkGanA5yUvaLa2UPMsr02um6nY9q0WrQyAgA0a9jgUGIS7u3DFUtvldFAxnmq+HFX8ZLbUD8MRZ6cKxavEs5YscJpN1M931ZXHjuAe+8RACAIFUNUjSWVq0pXxrQVjjqKoUQMZ5TCOItnxOM5USfR0tZrB2eKo5sfpVYpfs+FBr/HLTrHSU6sijNexTiVil+vFr9yinMqY4pa4oz2FOOIbmz+H+YaY51nFUhqAAAAAElFTkSuQmCC",
};


router.post("/login", (req, res) => {
  console.log(req.body);
  db.collection("users")
    .where("email", "==", req.body.email)
    .where("password", "==", req.body.password)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("Not Found!");
        res.status(404).json("Email or password is wrong");
      } else {
        console.log("Name and email match!");
        const docData = snapshot.docs[0].data();
        const docId = snapshot.docs[0].id;
        const doc = { id: docId, ...docData };
        res.status(200).json(doc);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

router.get("/getuserdetail/:id", (req, res) => {
  const collectionRef = db.collection("studentDetails");
  const id = req.params.id;
  const docRef = collectionRef.doc(id);
  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        res.json(doc.data());
      } else {
        res.status(404).send("Document not found");
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// POST route to add a new user
router.post("/signup", (req, res) => {
  console.log(req.body);
  db.collection("users")
    .where("email", "==", req.body.email)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        db.collection("users")
          .add({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            type: req.body.type,
          })
          .then((data) => {
            console.log(data.id);
            if (req.body.type === "Profesional") {
              professionalDetailsObject.ID = data.id;
              professionalDetailsObject.Name = req.body.username;
              db.collection("professionalDetails")
                .doc(data.id)
                .set(professionalDetailsObject);
              res.json({ message: "user added success" });
            } else if (req.body.type === "Student") {
              studentDetailsObject.ID = data.id;
              studentDetailsObject.Name = req.body.username;
              db.collection("studentDetails")
                .doc(data.id)
                .set(studentDetailsObject);
              res.json({ message: "user added success" });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send(err);
          });
      } else {
        res.status(400).json({ message: "Email already exists" });
      }
    });
});

router.post("/addUserDetails", (req, res) => {
  if (req.body.type === "Student" || req.body.type == "Profession") {
    let type;
    req.body.type === "Student"
      ? (type = "studentDetails")
      : (type = "professionalDetails");
    let docRef = db.collection(type).doc(req.body.id);
    let updatedData = req.body.updateData;
    docRef.update(updatedData);
    res.send(`user updated success`);
  } else {
    res.status(400).json("The type you are providing is not valid");
  }
});

// GET method to search users
router.get("/searchUser", (req, res) => {
  let query = db.collection('users');
  let criteria = req.body.criteria
  switch(criteria){
    case "email":
      query = query.where('email', '==', req.body.query);
      break;
    case "name":
        query = query.where('name', '==', req.body.query);
        break;
    // case "id":
    //     query = query.where('id', '==', req.body.query);
    //     break;
    default:
      res.status(400).json("The search criteria you are providing is not valid!")
      return

  }
    
  // Get the results
  query.get().then(snapshot => {
    snapshot.forEach(doc => {
      console.log(doc.data());
    });
    res.status(200).send(snapshot.docs[0].data())
  }).catch(err => {
    console.log('Error getting documents', err);
    res.status(500).send(err)
  });
});

module.exports = router;
