#!/usr/bin/env python3
"""Normalize generated FinMate turn sprites to the checked canvas contract."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


PARTY = {
    "canvas": 512,
    "baseline": 460,
    "margin": 40,
    "target_height": 410,
    "min_height": 400,
}
BOSS = {
    "canvas": 768,
    "baseline": 690,
    "margin": 60,
    "target_height": 610,
    "min_height": 600,
}
TURN_ASSET_FILENAMES = (
    "invest-idle-right.png",
    "invest-attack-right.png",
    "invest-victory.png",
    "save-idle-right.png",
    "save-attack-right.png",
    "save-victory.png",
    "consume-idle-right.png",
    "consume-attack-right.png",
    "consume-victory.png",
    "mission-idle-right.png",
    "mission-attack-right.png",
    "mission-victory.png",
    "boss-idle-left.png",
    "boss-hit-left.png",
    "boss-defeated.png",
)


def visible_bbox(image: Image.Image, threshold: int = 16) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A")
    mask = alpha.point(lambda value: 255 if value >= threshold else 0)
    bbox = mask.getbbox()
    if bbox is None:
        raise ValueError("image has no visible alpha silhouette")
    return bbox


def normalize(source: Path, destination: Path) -> None:
    contract = BOSS if source.name.startswith("boss-") else PARTY
    with Image.open(source) as opened:
        image = opened.convert("RGBA")

    left, top, right, bottom = visible_bbox(image)
    cropped = image.crop((left, top, right, bottom))
    max_width = contract["canvas"] - contract["margin"] * 2
    scale = min(
        contract["target_height"] / cropped.height,
        max_width / cropped.width,
    )
    resized_width = round(cropped.width * scale)
    resized_height = round(cropped.height * scale)
    if resized_height < contract["min_height"]:
        raise ValueError(
            f"{source.name}: silhouette is too wide for the contract "
            f"({resized_width}×{resized_height}px after fitting)"
        )

    # Resize premultiplied RGBA so transparent key-color pixels cannot create a fringe.
    resized = cropped.convert("RGBa").resize(
        (resized_width, resized_height),
        Image.Resampling.LANCZOS,
    ).convert("RGBA")
    canvas = Image.new(
        "RGBA",
        (contract["canvas"], contract["canvas"]),
        (0, 0, 0, 0),
    )
    x = round((contract["canvas"] - resized_width) / 2)
    y = contract["baseline"] - resized_height + 1
    canvas.alpha_composite(resized, (x, y))

    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(destination, format="PNG", optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--destination", type=Path, required=True)
    args = parser.parse_args()

    source_by_name = {source.name: source for source in args.source.glob("*.png")}
    expected = set(TURN_ASSET_FILENAMES)
    found = set(source_by_name)
    if found != expected:
        missing = ", ".join(sorted(expected - found)) or "none"
        unexpected = ", ".join(sorted(found - expected)) or "none"
        raise SystemExit(
            f"source filenames do not match the turn asset contract; "
            f"missing: {missing}; unexpected: {unexpected}"
        )
    sources = [source_by_name[name] for name in TURN_ASSET_FILENAMES]
    for source in sources:
        destination = args.destination / source.name
        normalize(source, destination)
        print(f"Wrote {destination}")


if __name__ == "__main__":
    main()
